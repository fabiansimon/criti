import Text from "~/components/typography/text";
import Modal from "./modal";
import LoadingSpinner from "../loading-spinner";

interface LoadingModalProps {
  isVisible: boolean;
}
export default function LoadingModal({ isVisible }: LoadingModalProps) {
  return (
    <Modal isVisible={isVisible}>
      <div className="flex flex-col items-center space-y-2">
        <Text.Body className="text-white">
          This might take a few seconds...
        </Text.Body>
        <LoadingSpinner />
      </div>
    </Modal>
  );
}
