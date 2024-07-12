import { Card, Tooltip } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

interface Ad {
  name: string;
  quantity: number;
}

interface SubCampaign {
  name: string;
  status: boolean;
  ads: Ad[];
}

interface SubCampaignCardProps {
  subCampaign: SubCampaign;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
  isInvalid: boolean;
}

const SubCampaignCard: React.FC<SubCampaignCardProps> = ({
  subCampaign,
  index,
  isSelected,
  onSelect,
  isInvalid,
}) => (
  <Card
    onClick={onSelect}
    style={{
      border: isSelected ? "2px solid #007bff" : "1px solid #ccc",
    }}
    className="bg-white text-xl justify-center pt-4 flex shadow-lg rounded-md mb-1 border w-[220px] h-[120px] flex-shrink-0"
  >
    <div>
      <div className="flex gap-2">
        <Tooltip title={subCampaign.name} arrow placement="top">
          <div
            style={{ color: isInvalid ? "#FF0000" : "black" }}
            className="line-clamp-1 w-[180px]"
          >
            {subCampaign.name || `Chiến dịch con ${index + 1}`}
          </div>
        </Tooltip>
        <div>
          {subCampaign.status ? (
            <CheckCircleIcon
              className="text-[#008000] mb-1"
              style={{ width: 14 }}
            />
          ) : (
            <CheckCircleIcon
              className="text-[#8D8D8D] mb-1"
              style={{ width: 14 }}
            />
          )}
        </div>
      </div>
      {subCampaign.ads.reduce(
        (totalQuantity, ad) => totalQuantity + ad.quantity,
        0
      )}
    </div>
  </Card>
);

export default SubCampaignCard;
