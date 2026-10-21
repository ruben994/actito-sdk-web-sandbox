import {
  createBackdrop,
  createModal,
  createModalContent,
  createModalFooter,
  createModalHeader,
  createPrimaryButton,
  createRoot,
  createSecondaryButton,
} from '@actito/web-ui';
import { ROOT_ELEMENT_IDENTIFIER } from '~/internal/ui/root';
import { getApplicationIcon, getApplicationName } from '~/internal/utils';
import { logger } from '~/logger';

export function createCameraCallbackModal({
  hasMoreSteps,
  onMediaCaptured,
  dismiss,
}: CreateCameraCallbackParams): HTMLElement {
  const root = createRoot(ROOT_ELEMENT_IDENTIFIER);
  const video = document.createElement('video');
  video.classList.add('actito__camera-callback-video');
  video.setAttribute('autoplay', '');

  let streamPromise = setupVideoStream(video);

  function handleDismiss() {
    dismiss();

    streamPromise.finally(() => {
      cancelVideoStream(video);
    });
  }

  root.appendChild(createBackdrop(() => handleDismiss()));

  const modal = root.appendChild(createModal());
  modal.classList.add('actito__camera-callback');

  modal.appendChild(
    createModalHeader({
      icon: getApplicationIcon(),
      title: getApplicationName(),
      onCloseButtonClicked: () => handleDismiss(),
    }),
  );

  const content = modal.appendChild(createModalContent());
  content.appendChild(video);

  const canvas = document.createElement('canvas');
  canvas.classList.add('actito__camera-callback-canvas');

  const footer = modal.appendChild(createModalFooter());
  footer.classList.add('actito__modal-footer__callback');

  const takePictureButton = footer.appendChild(
    createPrimaryButton({
      text: 'Take picture',
      onClick: () => {
        const canvasContext = canvas.getContext('2d');
        if (!canvasContext) {
          logger.warning('The Canvas API is not available.');
          return;
        }

        // Draw the video stream onto the canvas.
        canvasContext.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Stop the video stream.
        streamPromise.finally(() => {
          cancelVideoStream(video);
        });

        content.removeChild(video);
        content.appendChild(canvas);

        footer.removeChild(takePictureButton);
        footer.appendChild(retakePictureButton);
        footer.appendChild(sendButton);
      },
    }),
  );

  const retakePictureButton = createSecondaryButton({
    text: 'Retake picture',
    onClick: () => {
      content.removeChild(canvas);
      content.appendChild(video);

      streamPromise.finally(() => {
        streamPromise = setupVideoStream(video);
      });

      footer.removeChild(retakePictureButton);
      footer.removeChild(sendButton);
      footer.appendChild(takePictureButton);
    },
  });

  const sendButton = createPrimaryButton({
    text: hasMoreSteps ? 'Continue' : 'Send',
    onClick: () => {
      canvas.toBlob((blob) => {
        if (!blob) {
          logger.warning('Unable to create a blob to upload.');
          return;
        }

        onMediaCaptured(blob, 'image/jpg');
      }, 'image/jpg');
    },
  });

  return root;
}

function setupVideoStream(video: HTMLVideoElement) {
  const streamPromise = createVideoStream();
  streamPromise
    .then((stream) => {
      video.srcObject = stream;
    })
    .catch((error) => {
      logger.error('Unable to acquire a video stream.', error);
    });

  return streamPromise;
}

async function createVideoStream(): Promise<MediaStream> {
  const supported = 'mediaDevices' in navigator;
  if (!supported) throw new Error('WebRTC API unavailable.');

  return navigator.mediaDevices.getUserMedia({
    video: {
      width: 1280,
      height: 720,
    },
  });
}

function cancelVideoStream(video: HTMLVideoElement) {
  const stream = video.srcObject as MediaStream | null;
  stream?.getTracks()?.forEach((track) => track.stop());
  video.srcObject = null;
}

interface CreateCameraCallbackParams {
  hasMoreSteps: boolean;
  onMediaCaptured: (blob: Blob, mimeType: string) => void;
  dismiss: () => void;
}
