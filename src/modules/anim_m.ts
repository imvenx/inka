import { allowedEls } from "src/modules/constants";
import { SvEl } from "src/models/models";
import { ref } from "vue";
import { svgIO } from "./svgIO_m";
import { svEl } from "./svel_m";

export const svgEl = () => document.getElementById('svg5')
export const svgElCont = svgEl()?.parentElement

const _currentTime = ref(0)

const _duration = ref(1)
const _isPlayingAnim = ref(false)

export const AnimM = {
    get currentTime() { return _currentTime.value },
    set currentTime(v: number) { _currentTime.value = v },
    get duration() { return _duration.value },
    set duration(v: number) { _duration.value = v },

    get isPlayingAnim() { return _isPlayingAnim.value },
    set isPlayingAnim(v: boolean) { _isPlayingAnim.value = v },
    async pauseOrPlayAnim() {
        this.isPlayingAnim ? await this.pauseAnim(svEl.value) : await this.playAnim(svEl.value)
    },

    async playAnim(svEl: SvEl): Promise<void> {
        this.isPlayingAnim = true
        await playAnimLoop(svEl)
        requestAnimationFrame(startRefreshCurrentTime)
    },

    async pauseAnim(svEl: SvEl) {
        stopRefreshCurrentTime()
        this.isPlayingAnim = false
        await pauseAnimLoop(svEl)

        const anim = svgEl()?.getAnimations()[0]
        if (anim) this.currentTime = roundedCurrentTime(anim)

        await svgIO.output()
    },

    async selectTime(time: number, svEl: SvEl, output = true) {
        stopRefreshCurrentTime()
        this.isPlayingAnim = false
        this.currentTime = Math.round(time * 1000) / 1000
        await updateAnimCurrentFrame(svEl)
        if (output) await svgIO.output()
    }

}

let requestAnimationFrameId: number
function startRefreshCurrentTime() {
    const el = svgEl()
    const x = el?.getAnimations()
    let a = {} as any
    if (x) a = x[x?.length - 1]
    AnimM.currentTime = roundedCurrentTime(a)
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
    }
    else {
        anim = domEl?.animate(svEl.kfs, {
            duration: AnimM.duration * 1000,
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

const roundedCurrentTime = (a: Animation) =>
    Math.round((AnimM.currentTime + a.currentTime!) % (AnimM.duration * 1000)) / 1000

async function updateAnimCurrentFrame(svEl: SvEl) {
    await updateAnimCurrentFrameLoop(svEl)
}

async function updateAnimCurrentFrameLoop(svEl: SvEl) {
    svEl.children?.forEach(async (child: SvEl) => await updateAnimCurrentFrameLoop(child))
    if (!allowedEls.includes(svEl.tagName)) return

    const domEl = document.getElementById(svEl.id)
    let anim = domEl?.getAnimations()[0]
    if (!anim) {
        anim = domEl?.animate(svEl.kfs, {
            duration: AnimM.duration * 1000,
            iterations: Infinity,
        })
        anim?.pause()
        anim?.commitStyles()
        return
    }
    anim.currentTime = AnimM.currentTime * 1000
    const eff = (anim?.effect as KeyframeEffect)
    anim.pause()
    anim?.commitStyles()
}