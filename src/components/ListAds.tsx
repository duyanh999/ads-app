import {
  Button,
  Checkbox,
  Divider,
  IconButton,
  TextField,
} from "@mui/material";
import { Field, FieldArray, FieldArrayRenderProps } from "formik";
import React from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

interface Ad {
  name: string;
  quantity: number;
}

interface SubCampaign {
  name: string;
  status: boolean;
  ads: Ad[];
}

interface Campaign {
  name: string;
  describe?: string;
  subCampaigns: SubCampaign[];
}

interface ListAdsProps {
  selectedItemIndex: number | null;
  selectedAds: number[];
  setSelectedAds: React.Dispatch<React.SetStateAction<number[]>>;
  values: Campaign;
  errors: any;
  isSubmitted: boolean;
}

const ListAds: React.FC<ListAdsProps> = ({
  selectedItemIndex,
  selectedAds,
  setSelectedAds,
  values,
  errors,
  isSubmitted,
}) => {
  const [selectAll, setSelectAll] = React.useState<boolean>(false);

  const handleSelectAllChange = (ads: Ad[]): void => {
    if (selectAll) {
      setSelectedAds([]);
    } else {
      setSelectedAds(ads.map((_, index) => index));
    }
    setSelectAll(!selectAll);
  };

  const handleAdCheckboxChange = (adIndex: number): void => {
    setSelectedAds((prevSelectedAds) =>
      prevSelectedAds.includes(adIndex)
        ? prevSelectedAds.filter((index) => index !== adIndex)
        : [...prevSelectedAds, adIndex]
    );
  };

  const handleDeleteSelectedAds = (removeAd: (index: number) => void) => {
    if (selectedItemIndex !== null) {
      selectedAds.sort((a, b) => b - a).forEach(removeAd);
      setSelectedAds([]);
    }
  };

  const handleDeleteAd = (
    adIndex: number,
    removeAd: (index: number) => void
  ) => {
    removeAd(adIndex);
    setSelectedAds((prevSelectedAds) =>
      prevSelectedAds.filter((index) => index !== adIndex)
    );
  };

  return (
    <div className="mt-10">
      <div className="text-xl mb-7 px-3 flex justify-start">
        DANH SÁCH QUẢNG CÁO
      </div>

      <FieldArray name={`subCampaigns[${selectedItemIndex!}].ads`}>
        {({
          push: pushAd,
          remove: removeAd,
        }: FieldArrayRenderProps): JSX.Element => (
          <div>
            <div className="flex gap-4 w-full justify-between items-center mb-4">
              <div>
                <Checkbox
                  checked={selectedAds.length > 0}
                  indeterminate={
                    selectedAds.length > 0 &&
                    selectedAds.length <
                      values.subCampaigns[selectedItemIndex!].ads.length
                  }
                  onChange={(): void =>
                    handleSelectAllChange(
                      values.subCampaigns[selectedItemIndex!].ads
                    )
                  }
                />
              </div>
              {selectedAds.length > 0 ? (
                selectAll ? (
                  <IconButton
                    className="absolute right-[43.5%]"
                    style={{ color: "#757575" }}
                    onClick={(): void => handleDeleteSelectedAds(removeAd)}
                  >
                    <DeleteIcon />
                  </IconButton>
                ) : (
                  <IconButton
                    className="absolute right-[43.5%]"
                    style={{ color: "#757575" }}
                    onClick={(): void => handleDeleteSelectedAds(removeAd)}
                  >
                    <DeleteIcon />
                  </IconButton>
                )
              ) : (
                <>
                  <div className="absolute left-[6.5%]">
                    <div>Tên quảng cáo*</div>
                  </div>
                  <div className="absolute left-[40%]">
                    <div>Số lượng*</div>
                  </div>
                </>
              )}

              <Button
                className="w-[6.5%] rounded-full bg-gray-500 flex items-center cursor-pointer"
                variant="outlined"
                onClick={(): void =>
                  pushAd({
                    name: "",
                    quantity: 0,
                  })
                }
              >
                <div className="flex justify-between gap-2 items-center">
                  <AddIcon fontSize="small" />
                  <div>Thêm</div>
                </div>
              </Button>
            </div>
            <Divider />
            {values.subCampaigns[selectedItemIndex!].ads.map(
              (ad: Ad, adIndex: number) => (
                <div
                  key={adIndex}
                  className={` ${
                    selectedAds.includes(adIndex)
                      ? "bg-pink-100"
                      : "hover:bg-neutral-100"
                  }`}
                >
                  <div className={`flex gap-4 mb-4 `}>
                    <Checkbox
                      checked={selectedAds.includes(adIndex)}
                      onChange={(): void => handleAdCheckboxChange(adIndex)}
                      color="primary"
                    />
                    <Field
                      as={TextField}
                      name={`subCampaigns[${selectedItemIndex!}].ads[${adIndex}].name`}
                      label={`Tên quảng cáo`}
                      className={"w-[60%]"}
                      variant="standard"
                      error={
                        isSubmitted &&
                        !!(
                          (errors.subCampaigns as any)?.[selectedItemIndex!]
                            ?.ads as any
                        )?.[adIndex]?.name
                      }
                    />
                    <Field
                      as={TextField}
                      name={`subCampaigns[${selectedItemIndex!}].ads[${adIndex}].quantity`}
                      label="Số lượng"
                      className={"w-40%]"}
                      fullWidth
                      variant="standard"
                      error={
                        isSubmitted &&
                        !!(
                          (errors.subCampaigns as any)?.[selectedItemIndex!]
                            ?.ads as any
                        )?.[adIndex]?.quantity
                      }
                      type="number"
                    />

                    <IconButton
                      style={{ color: "#757575" }}
                      onClick={(): void => handleDeleteAd(adIndex, removeAd)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </div>
                  <Divider className="" />
                </div>
              )
            )}
          </div>
        )}
      </FieldArray>
    </div>
  );
};

export default ListAds;
