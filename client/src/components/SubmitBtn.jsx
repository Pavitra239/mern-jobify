import { useNavigation } from "react-router-dom";

const SubmitBtn = ({ formBtn, text }) => {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "Submitting...";
  return (
    <button
      type="submit"
      className={`btn btn-block ${formBtn && "form-btn"}`}
      disabled={isSubmitting}
    >
      {isSubmitting ? "Submitting..." : text || "Submit"}
    </button>
  );
};
export default SubmitBtn;
