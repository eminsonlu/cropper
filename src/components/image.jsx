import { useCallback, useEffect, useRef, useState } from "react";
import { usePosition } from "../store/position-store";

export default function Image() {
  const [dragging, setDragging] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [oldPosition, setOldPosition] = useState({ x: 0, y: 0 });
  const { state, dispatch } = usePosition();
  const ref = useRef();

  const startFunction = useCallback(() => {
    if (!ref.current || !state.file.image || !state.file.preview) return;

    const innerHeight = window.innerHeight;
    const innerWidth = window.innerWidth;

    const imageWidth = state.file.width;
    const imageHeight = state.file.height;

    const imageRatio = imageWidth / imageHeight;

    let width = 0;
    let height = 0;

    if (imageRatio > 1) {
      width = innerWidth * 0.8;
      height = width / imageRatio;
    } else {
      height = innerHeight * 0.8;
      width = height * imageRatio;
    }

    setDimensions({ width, height });

    const cropperWidth = width * 0.8;
    const cropperHeight = height * 0.8;

    const top = (height - cropperHeight) / 2;
    const left = (width - cropperWidth) / 2;

    dispatch({
      type: "SET_POSITION",
      payload: {
        position: { top, left },
        width: cropperWidth,
        height: cropperHeight,
      },
    });
  }, [
    dispatch,
    state.file.height,
    state.file.image,
    state.file.preview,
    state.file.width,
  ]);

  useEffect(() => {
    startFunction();
  }, [startFunction]);

  const onMouseDown = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const onMouseMove = (e) => {
    if (!dragging || !ref.current) return;
    const oldX = oldPosition.x;
    const oldY = oldPosition.y;

    const refWidth = ref.current.offsetWidth;
    const refHeight = ref.current.offsetHeight;

    let newTop = 0;
    let newLeft = 0;

    if (e.clientX - oldX > 0) {
      newLeft = state.position.left + (e.clientX - oldX);
    } else {
      newLeft = state.position.left - (oldX - e.clientX);
    }

    if (e.clientY - oldY > 0) {
      newTop = state.position.top + (e.clientY - oldY);
    } else {
      newTop = state.position.top - (oldY - e.clientY);
    }

    if (newTop < 0) {
      newTop = 0;
    }

    if (newLeft < 0) {
      newLeft = 0;
    }

    if (newTop + state.height > refHeight) {
      newTop = refHeight - state.height;
    }

    if (newLeft + state.width > refWidth) {
      newLeft = refWidth - state.width;
    }

    dispatch({
      type: "SET_POSITION",
      payload: {
        position: { top: newTop, left: newLeft },
        width: state.width,
        height: state.height,
      },
    });

    setOldPosition({
      x: e.clientX,
      y: e.clientY,
    });
  };

  const onMouseUp = () => {
    setDragging(false);
  };

  return (
    <div
      ref={ref}
      style={{
        width: dimensions.width,
        height: dimensions.height,
      }}
      className="relative"
    >
      {state.active && (
        <>
          <div className="absolute top-0 left-0 bottom-0 right-0">
            <div
              style={{
                width: dimensions.width,
                height: dimensions.height,
              }}
              className="absolute top-0 left-0 bottom-0 right-0 transform-none"
            >
              <img
                src={state.file.preview}
                alt="image"
                style={{
                  width: dimensions.width,
                  height: dimensions.height,
                }}
                className="block max-h-none max-w-none min-h-0 !min-w-0 align-middle object-contain"
              />
            </div>
          </div>
          <div className="absolute top-0 left-0 bottom-0 right-0 bg-black/50"></div>
          <div
            style={{
              width: state.width,
              height: state.height,
              top: state.position.top,
              left: state.position.left,
            }}
            className="absolute top-0 left-0 bottom-0 right-0"
          >
            <div
              style={{
                outline: "1px solid #fff",
                cursor: "move",
              }}
              className="block w-full h-full overflow-hidden"
              onMouseDown={onMouseDown}
              onMouseMove={onMouseMove}
              onMouseUp={onMouseUp}
              onMouseLeave={onMouseUp}
            >
              <img
                src={state.file.preview}
                alt="cropped image"
                style={{
                  width: dimensions.width,
                  height: dimensions.height,
                  transform: `translate(-${state.position.left}px, -${state.position.top}px)`,
                }}
                className="block max-h-none max-w-none min-h-0 !min-w-0 align-middle object-contain"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
