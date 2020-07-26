import { useField } from "formik";

const URLField = ({ label, ...props }) => {
  const [field, meta, helpers] = useField(props);
  return (
    <>
      <input
        style={{ width: "23em", padding: "1em", textAlign: "center" }}
        placeholder="https://www.instagram.com/p/CB2ATDSl4Sh/"
        {...field}
        {...props}
      />
      {meta.touched && meta.error ? (
        <div style={{ color: "red" }}>{meta.error}</div>
      ) : null}
    </>
  );
};

export default URLField;
