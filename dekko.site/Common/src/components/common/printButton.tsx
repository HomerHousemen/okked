import React from "react";
import Fab from "@material-ui/core/Fab";
import {LocalPrintshopOutlined} from "@material-ui/icons";

export const PrintButton = (props: any) => {
    return (
        <Fab
            aria-label="print"
            size="small"
            color="primary"
            className={`d-print-none ${props?.className}`}
            onClick={(e) => {
                e.preventDefault();
                window.print();
            }}
        >
            <LocalPrintshopOutlined/>
        </Fab>
    );
};
