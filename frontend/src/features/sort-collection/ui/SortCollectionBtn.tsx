import { ListFilter } from "lucide-react";
import "./SortCollectionBtn.css";
import type { MenuProps } from "antd";
import { Dropdown } from "antd";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/app/store";
import { setSortBy } from "../model/slice";

interface ISortCollectionBtn { }

const SortCollectionBtn = ({ }: ISortCollectionBtn) => {
  const dispatch = useDispatch<AppDispatch>()

  const menuItmes: MenuProps["items"] = [
    {
      key: "date",
      label: "Date",
    },
    {
      key: "name",
      label: "Name",
    },
    {
      key: "default",
      label: "Default",
    },
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
    dispatch(setSortBy(key))
  };

  return (
    <div>
      <Dropdown
        trigger={["click"]}
        menu={{ items: menuItmes, onClick: handleMenuClick }}
        placement="bottomLeft"
      >
        <button className="albums-filter-btn">
          <ListFilter size={16} />
        </button>
      </Dropdown>
    </div>
  );
};

export default SortCollectionBtn;
