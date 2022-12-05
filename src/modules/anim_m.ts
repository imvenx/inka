import { allowedEls } from "src/modules/constants";
import { SvEl } from "src/models/models";
import { ref } from "vue";
import { svgIO } from "./svgIO_m";
import { StorageM } from "./storage_m";
import { SvElM } from "./svel_m";
import { KfsM } from "./keyframe_m";

export const svgEl = () => document.getElementById('svg5')
export const svgElCont = svgEl()?.parentElement

const _currentTimeSeconds = ref(0)

const _durationSeconds = ref(StorageM.getDuration())
let _oldDurationSeconds = _durationSeconds.value

const _isPlayingAnim = ref(false)

const _recalculateKfsOnChangeDuration = ref(true)

export const AnimM = {
    get currentTimeSeconds() { return _currentTimeSeconds.value },
    set currentTimeSeconds(v: number) { _currentTimeSeconds.value = v },

    get currentTimeMiliseconds() { return _currentTimeSeconds.value * 1000 },
    set currentTimeMiliseconds(v: number) { _currentTimeSeconds.value = Math.round(v) / 1000 },

    get durationSeconds() { return _durationSeconds.value },
    set durationSeconds(v: number) {
        if (v <= 0) v = 0.1
        _oldDurationSeconds = _durationSeconds.value
        _durationSeconds.value = v;
        StorageM.setDuration(v);
        updateAnimDurationLoop(SvElM.rootSvEl)
    },

    get durationMiliseconds() { return this.durationSeconds * 1000 },
    set durationMiliseconds(v: number) { this.durationSeconds = v / 1000 },

    get isPlayingAnim() { return _isPlayingAnim.value },
    set isPlayingAnim(v: boolean) { _isPlayingAnim.value = v },
    async pauseOrPlayAnim() {
        this.isPlayingAnim ? await this.pauseAnim(SvElM.rootSvEl) : await this.playAnim(SvElM.rootSvEl)
    },

    async playAnim(svEl: SvEl): Promise<void> {
        svgIO.clearOutputTimeout()
        this.isPlayingAnim = true
        await playAnimLoop(svEl)
        requestAnimationFrame(startRefreshCurrentTime)
    },

    async pauseAnim(svEl: SvEl) {
        stopRefreshCurrentTime()
        this.isPlayingAnim = false
        await pauseAnimLoop(svEl)

        const anim = svgEl()?.getAnimations()[0]
        if (anim) this.currentTimeMiliseconds = animTime(anim)
        await svgIO.output()
    },

    async refreshAnim(svEl: SvEl): Promise<void> {
        await refreshAnimLoop(svEl)
    },

    get recalculateKfsOnChangeDuration() { return _recalculateKfsOnChangeDuration.value },
    set recalculateKfsOnChangeDuration(v: boolean) { _recalculateKfsOnChangeDuration.value = v },

    async selectTime(miliseconds: number, svEl: SvEl) {
        stopRefreshCurrentTime()
        this.isPlayingAnim = false
        this.currentTimeMiliseconds = miliseconds
        if (this.currentTimeMiliseconds >= this.durationMiliseconds)
            this.currentTimeMiliseconds -= 1
        await updateAnimCurrentFrame(svEl)
        await svgIO.output()
    }
}

let requestAnimationFrameId: number
function startRefreshCurrentTime() {
    const el = svgEl()
    const animations = el?.getAnimations()!
    let anim = animations[animations?.length - 1]

    // if (x) a = x[x?.length - 1]
    AnimM.currentTimeMiliseconds = animTime(anim)
    requestAnimationFrameId = requestAnimationFrame(startRefreshCurrentTime)
}

function stopRefreshCurrentTime() {
    window.cancelAnimationFrame(requestAnimationFrameId)
}

async function playAnimLoop(svEl: SvEl) {
    svEl.children?.forEach(async (child) => await playAnimLoop(child))
    if (!allowedEls.includes(svEl.tagName)) return

    // TODO: instead of access document.getById should be svgContainer.getById or smt else
    const domEl = document.getElementById(svEl.id)
    let anim = domEl?.getAnimations()[0]
    const eff = (anim?.effect as KeyframeEffect)

    if (eff && anim) {
        eff.setKeyframes(svEl.kfs);
        anim?.play()
        eff.updateTiming({ duration: AnimM.durationMiliseconds })
    }
    else {
        anim = domEl?.animate(svEl.kfs, {
            duration: AnimM.durationMiliseconds,
            iterations: Infinity,
        })
    }
}

async function pauseAnimLoop(svEl: SvEl) {
    svEl.children?.forEach(async (child: SvEl) => await pauseAnimLoop(child))
    if (!allowedEls.includes(svEl.tagName)) return

    const domEl = document.getElementById(svEl.id)
    domEl?.getAnimations().forEach(anim => {
        anim.pause();
        anim.commitStyles();
    })
}

async function refreshAnimLoop(svEl: SvEl) {
    svEl.children?.forEach(async (child) => await refreshAnimLoop(child))
    if (!allowedEls.includes(svEl.tagName)) return

    const domEl = document.getElementById(svEl.id)
    let anim = domEl?.getAnimations()[0]
    const eff = (anim?.effect as KeyframeEffect)
    if (eff && anim) {
        eff.setKeyframes(svEl.kfs);
        eff.updateTiming({ duration: AnimM.durationMiliseconds })
    }
    else {
        anim = domEl?.animate(svEl.kfs, {
            duration: AnimM.durationMiliseconds,
            iterations: Infinity,
        })
        anim?.pause()
    }
}

const animTime = (a: Animation) => (a.currentTime! % AnimM.durationMiliseconds)

async function updateAnimCurrentFrame(svEl: SvEl) {
    await updateAnimCurrentFrameLoop(svEl)
}

async function updateAnimCurrentFrameLoop(svEl: SvEl) {
    svEl.children?.forEach(async (child: SvEl) => await updateAnimCurrentFrameLoop(child))
    if (!allowedEls.includes(svEl.tagName)) return

    const domEl = document.getElementById(svEl.id)
    if (!domEl) return
    let anim = domEl.getAnimations()[0]

    if (!anim) {
        anim = domEl.animate(svEl.kfs, {
            duration: AnimM.durationMiliseconds,
            iterations: Infinity,
        })
    }
    anim.currentTime = AnimM.currentTimeMiliseconds
    anim.pause()
    anim.commitStyles()

}

function updateAnimDurationLoop(svEl: SvEl) {
    svEl.children?.forEach(async (child: SvEl) => await updateAnimDurationLoop(child))
    if (!allowedEls.includes(svEl.tagName)) return

    const domEl = document.getElementById(svEl.id)
    if (!domEl) return
    let anim = domEl?.getAnimations()[0]

    if (AnimM.recalculateKfsOnChangeDuration) {
        svEl.kfs.forEach(kf => {
            kf.offset! /= AnimM.durationSeconds / _oldDurationSeconds
            if (kf.offset! > 1) kf.offset = 1
        })
        KfsM.updateKfs(svEl.id, svEl.kfs)
    }


    if (!anim) {
        anim = domEl?.animate(svEl.kfs, {
            duration: AnimM.durationMiliseconds,
            iterations: Infinity,
        })
        anim?.pause()
    }
    else {
        const eff = (anim?.effect as KeyframeEffect)
        eff.updateTiming({ duration: AnimM.durationMiliseconds })
        eff.setKeyframes(svEl.kfs)
    }
}