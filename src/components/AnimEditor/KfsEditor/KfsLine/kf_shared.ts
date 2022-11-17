import { AnimM } from "src/modules/anim_m";
import { ConfigM, timeSideOffsetPx } from "src/modules/config_m";

export const kfPos = (offset: number) =>
    offset! * AnimM.duration * ConfigM.zoomPx * ConfigM.numDecimals + timeSideOffsetPx