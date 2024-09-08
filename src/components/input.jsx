import { usePosition } from "../store/position-store";

export default function Input() {
  const { dispatch } = usePosition();

  const handleChange = (e) => {
    if (!e.target.files.length) return;

    const file = e.target.files[0];
    if (FileReader) {
      const fr = new FileReader();
      fr.onload = function () {
        const img = new Image();
        img.onload = function () {
          dispatch({
            type: "SET_FILE",
            payload: {
              name: file.name,
              type: file.type,
              size: file.size,
              lastModified: file.lastModified,
              width: img.width,
              height: img.height,
              preview: fr.result,
              image: file,
            },
          });
        };
        img.src = fr.result;
      };
      fr.readAsDataURL(file);
    }
  };

  return (
    <input
      type="file"
      accept="image/jpg, image/jpeg, image/png"
      onChange={handleChange}
      className="cursor-pointer"
    />
  );
}
