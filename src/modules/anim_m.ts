import { allowedEls } from "src/modules/constants";
import { SvEl } from "src/models/models";
import { ref } from "vue";
import { svgIO } from "./svgIO_m";
import { StorageM } from "./storage_m";
import { SvElM } from "./svel_m";
import { KfsM } from "./kfs_m";
import { CsSvgParser } from "./csSvgParser";
import { roundToDecimals } from "./utils";

export const svgEl = () => document.getElementById('svg5')
// export const svgElCont = svgEl()?.parentElement

export abstract class AnimM {

    // public static transformOrigin = ref('center')
    // public static transformBox = ref('fill-box')

    // public static transformOriginCenterAnimViewer() {
    //     this.transformOrigin.value = 'center'
    //     this.transformBox.value = 'fill-box'
    // }
    // public static transformOriginRevertAnimViewer() {
    //     this.transformOrigin.value = '0 0'
    //     this.transformBox.value = 'content-box'
    // }

    private static _currentTimeSeconds = ref(StorageM.getCurrentTimeSeconds())

    private static _durationSeconds = ref(StorageM.getDuration())
    private static _oldDurationSeconds = this._durationSeconds.value

    private static _isPlayingAnim = ref(false)

    private static _recalculateKfsOnChangeDuration = ref(true)

    //#region getters and setters

    static get currentTimeSeconds() { return this._currentTimeSeconds.value }
    static set currentTimeSeconds(v: number) { this._currentTimeSeconds.value = v }

    static get currentTimeMiliseconds() { return this._currentTimeSeconds.value * 1000 }
    static set currentTimeMiliseconds(v: number) {
        this.currentTimeSeconds = Math.round(v) / 1000
    }

    private static _isRecording = ref(false);
    static get isRecording() { return this._isRecording.value }
    static set isRecording(v: boolean) { this._isRecording.value = v }

    static get currentOffset(): number {
        return roundToDecimals(3, this.currentTimeMiliseconds / this.durationMiliseconds)
    }

    static get durationSeconds() { return this._durationSeconds.value }
    static set durationSeconds(v: number) {
        if (v <= 0) v = 0.1
        this._oldDurationSeconds = this._durationSeconds.value
        this._durationSeconds.value = v;
        StorageM.setDuration(v);
        this.updateAnimDurationLoop(SvElM.rootSvEl)
    }

    static get durationMiliseconds() { return this.durationSeconds * 1000 }
    static set durationMiliseconds(v: number) { this.durationSeconds = v / 1000 }

    static get isPlayingAnim() { return this._isPlayingAnim.value }
    static set isPlayingAnim(v: boolean) { this._isPlayingAnim.value = v }

    //#endregion

    //#region public functions

    static async pauseOrPlayAnim() {
        this.isPlayingAnim ? await this.pauseAnim(SvElM.rootSvEl) : await this.playAnim(SvElM.rootSvEl)
    }

    static async playAnim(svEl: SvEl): Promise<void> {
        // this.transformOriginCenterAnimViewer()

        svgIO.clearOutputTimeout()
        this.isPlayingAnim = true
        await this.playAnimLoop(svEl)
        requestAnimationFrame(this.startRefreshCurrentTime)
    }

    static async pauseAnim(svEl: SvEl) {
        this.stopRefreshCurrentTime()
        this.isPlayingAnim = false
        await this.pauseAnimLoop(svEl)

        const anim = svgEl()?.getAnimations()[0]
        if (anim) this.currentTimeMiliseconds = this.animTime(anim)
        await svgIO.output()
    }

    static async refreshAnim(svEl: SvEl): Promise<void> {
        await this.refreshAnimLoop(svEl)
        // svgIO.output()
    }

    static get recalculateKfsOnChangeDuration() {
        return this._recalculateKfsOnChangeDuration.value
    }
    static set recalculateKfsOnChangeDuration(v: boolean) {
        this._recalculateKfsOnChangeDuration.value = v
    }

    static async selectTime(miliseconds: number, svEl: SvEl, output: boolean = true) {
        // this.transformOriginCenterAnimViewer()

        this.stopRefreshCurrentTime()
        this.isPlayingAnim = false
        this.currentTimeMiliseconds = miliseconds
        if (this.currentTimeMiliseconds >= this.durationMiliseconds)
            this.currentTimeMiliseconds -= 1
        await this.updateAnimCurrentFrame(svEl)
        if (output) await svgIO.output()
    }

    //#endregion

    //#region private functions

    private static requestAnimationFrameId: number
    private static startRefreshCurrentTime() {
        const el = svgEl()
        const animations = el?.getAnimations()!
        let anim = animations[animations?.length - 1]

        AnimM.currentTimeMiliseconds = AnimM.animTime(anim)
        AnimM.requestAnimationFrameId = requestAnimationFrame(AnimM.startRefreshCurrentTime)
    }

    private static stopRefreshCurrentTime() {
        window.cancelAnimationFrame(this.requestAnimationFrameId)
    }

    private static async playAnimLoop(svEl: SvEl) {
        svEl.children?.forEach(async (child) => await this.playAnimLoop(child))
        if (!allowedEls.includes(svEl.tagName)) return


        // TODO: instead of access document.getById should be svgContainer.getById or smt else
        const domEl = document.getElementById(svEl.id) as HTMLElement

        if (!domEl) return

        let anim = domEl.getAnimations()[0]

        if (anim) {
            const eff = (anim.effect as KeyframeEffect)
            eff.setKeyframes(svEl.kfs);
            anim?.play()
            eff.updateTiming({ duration: this.durationMiliseconds })
        }
        else {
            anim = domEl.animate(svEl.kfs, {
                duration: this.durationMiliseconds,
                iterations: Infinity,
            })
            anim.currentTime = this.currentTimeMiliseconds
        }
    }

    private static async pauseAnimLoop(svEl: SvEl) {
        svEl.children?.forEach(async (child: SvEl) => await this.pauseAnimLoop(child))
        if (!allowedEls.includes(svEl.tagName)) return

        const domEl = document.getElementById(svEl.id) as SVGAElement | null
        if (!domEl) return

        domEl.getAnimations().forEach(anim => {
            anim.pause();
            anim.commitStyles();
        });

        await CsSvgParser.updateAttrsFromInkaToInkscape(domEl)
        // (domEl.style as any).x = ''
    }

    private static async refreshAnimLoop(svEl: SvEl) {
        svEl.children?.forEach(async (child) => await this.refreshAnimLoop(child))
        if (!allowedEls.includes(svEl.tagName)) return

        const domEl = document.getElementById(svEl.id) as SVGAElement | null
        if (!domEl) return

        let anim = domEl.getAnimations()[0]
        if (!anim) {
            anim = domEl.animate(svEl.kfs, {
                duration: this.durationMiliseconds,
                iterations: Infinity,
            })
            anim?.pause()
        } else {
            const eff = (anim.effect as KeyframeEffect)
            eff.setKeyframes(svEl.kfs);
            eff.updateTiming({ duration: this.durationMiliseconds })
        }

        anim.commitStyles()
        await CsSvgParser.updateAttrsFromInkaToInkscape(domEl)
    }

    private static animTime = (a: Animation) => (a.currentTime! % this.durationMiliseconds)

    private static async updateAnimCurrentFrame(svEl: SvEl) {
        await this.updateAnimCurrentFrameLoop(svEl)
    }

    private static async updateAnimCurrentFrameLoop(svEl: SvEl) {
        svEl.children?.forEach(async (child: SvEl) =>
            await this.updateAnimCurrentFrameLoop(child))
        if (!allowedEls.includes(svEl.tagName)) return

        const domEl = document.getElementById(svEl.id) as SVGAElement | null
        if (!domEl) return
        let anim = domEl.getAnimations()[0]

        if (!anim) {
            anim = domEl.animate(svEl.kfs, {
                duration: this.durationMiliseconds,
                iterations: Infinity,
            })
        }
        anim.currentTime = this.currentTimeMiliseconds
        anim.pause()
        anim.commitStyles()

        await CsSvgParser.updateAttrsFromInkaToInkscape(domEl)
    }

    private static async updateAnimDurationLoop(svEl: SvEl) {
        svEl.children?.forEach(async (child: SvEl) => await this.updateAnimDurationLoop(child))
        if (!allowedEls.includes(svEl.tagName)) return

        const domEl = document.getElementById(svEl.id)
        if (!domEl) return
        let anim = domEl?.getAnimations()[0]

        if (this.recalculateKfsOnChangeDuration) {
            svEl.kfs.forEach(kf => {
                kf.offset! /= this.durationSeconds / this._oldDurationSeconds
                if (kf.offset! > 1) kf.offset = 1
            })
            KfsM.updateKfs(svEl.id, svEl.kfs)
        }


        if (!anim) {
            anim = domEl?.animate(svEl.kfs, {
                duration: this.durationMiliseconds,
                iterations: Infinity,
            })
            anim?.pause()
        }
        else {
            const eff = (anim?.effect as KeyframeEffect)
            eff.updateTiming({ duration: this.durationMiliseconds })
            eff.setKeyframes(svEl.kfs)
        }
    }

    //#endregion
}

