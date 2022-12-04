import { AnimM } from "src/modules/anim_m";
import { ConfigM, timeSideOffsetPx } from "src/modules/config_m";

export const kfPos = (offset: number) =>
    offset! * AnimM.durationSeconds * ConfigM.zoomPx * ConfigM.numDecimals + timeSideOffsetPx