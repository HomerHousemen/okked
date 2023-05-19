import React from "react";
import { useGlobal } from "../global";

export const InternalOnly = (props: any) => {
    const { isInternal } = useGlobal();
    return <>{isInternal && props.children}</>;
};

export const ExternalOnly = (props: any) => {
    const { isInternal } = useGlobal();
    return <>{!isInternal && props.children}</>;
};