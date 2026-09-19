// fsd dosen't exist tsx in model. 
// should replace icons
import { Clock, ArrowDownAZ, Layers } from "lucide-react";
import type { ISortOption } from "./types";

export const SORT_OPTIONS: ISortOption[] = [
    {
        key: "default",
        icon: <Layers size={18} />,
        label: "Default",
        description: "Original order",
    },
    {
        key: "date",
        icon: <Clock size={18} />,
        label: "Newest",
        description: "By date added",
    },
    {
        key: "name",
        icon: <ArrowDownAZ size={18} />,
        label: "By name",
        description: "Alphabetical (A - Z)",
    },
];