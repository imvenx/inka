import { allowedEls } from "src/modules/constants";
import { SvEl } from "src/models/models";
import { computed, ref, Static } from "vue";
import { svgIO } from "./svgIO_m";
import { svEl } from "./svel_m";

// #region Anim Module

export const svgEl = () => document.querySelector('svg')
export const svgElCont = svgEl()?.parentElement

// const fps = ref(20)
export const currentTime = ref(0)
let currentTimeRefeshInterval: any = {}

export const duration = ref(1000)
export const offset = computed(() => currentTime.value / duration.value)
// export const steps = computed(() => duration.value / 1000 * fps.value + 1)
const _isPlayingAnim = ref(false)

export const AnimM = {
    get isPlayingAnim() { return _isPlayingAnim.value },
    set isPlayingAnim(v: boolean) { _isPlayingAnim.value = v },
    async pauseOrPlayAnim() {
        this.isPlayingAnim ? await this.pauseAnim(svEl.value) : await this.playAnim(svEl.value)
    },
    async playAnim(svEl: SvEl): Promise<void> {
        this.isPlayingAnim = true
        await playAnimLoop(svEl)
        // startRefreshCurrentTimeInterval()
        requestAnimationFrame(startRefreshCurrentTime)
    },

    async pauseAnim(svEl: SvEl) {
        // stopRefreshCurrentTimeInterval()
        stopRefreshCurrentTime()
        this.isPlayingAnim = false
        await pauseAnimLoop(svEl)

        const anim = svgEl()?.getAnimations()[0]
        if (anim) currentTime.value = roundedCurrentTime(anim)
        // (currentTime.value + svgEl()?.getAnimations()[0].currentTime!) % duration.value

        await svgIO.output()
    },

    async selectTime(time: number, svEl: SvEl) {
        // stopRefreshCurrentTime()
        stopRefreshCurrentTime()
        this.isPlayingAnim = false
        currentTime.value = time
        await updateAnimCurrentFrame(svEl)
    }

}

// function startRefreshCurrentTimeInterval() {
//     const el = svgEl()
//     const x = el?.getAnimations()
//     let a = {} as any
//     if (x) a = x[x?.length - 1]
//     currentTimeRefeshInterval = setInterval(() => {
//         currentTime.value = roundedCurrentTime(a)
//     }, 0)
// }

let requestAnimationFrameId: number
function startRefreshCurrentTime() {
    const el = svgEl()
    const x = el?.getAnimations()
    let a = {} as any
    if (x) a = x[x?.length - 1]
    currentTime.value = roundedCurrentTime(a)
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
    const anim = domEl?.getAnimations()[0]
    const eff = (anim?.effect as KeyframeEffect)
    if (eff) { eff.setKeyframes(svEl.kfs); anim?.play() }
    else {
        domEl?.animate(svEl.kfs, {
            duration: duration.value,
            delay: -currentTime.value,
            iterations: Infinity,
        })
    }
}

async function pauseAnimLoop(svEl: SvEl) {
    svEl.children?.forEach(async (child: SvEl) => await pauseAnimLoop(child))
    if (!allowedEls.includes(svEl.tagName)) return

    const domEl = document.getElementById(svEl.id)
    domEl?.getAnimations().forEach(anim => {
        try {
            anim?.pause();
            // if (el.tagName != 'svg') // ???? 
            anim?.commitStyles();
        }
        catch { console.log('Error trying to pause el', svEl) }
    })
}

const roundedCurrentTime = (a: Animation) =>
    Math.round((currentTime.value + a.currentTime!) % duration.value) / 1000

// const stopRefreshCurrentTimeInterval = () => clearInterval(currentTimeRefeshInterval)


async function updateAnimCurrentFrame(svEl: SvEl) {
    await updateAnimCurrentFrameLoop(svEl)
    await svgIO.output()
}

async function updateAnimCurrentFrameLoop(svEl: SvEl) {
    svEl.children?.forEach(async (child: SvEl) => await updateAnimCurrentFrameLoop(child))
    if (!allowedEls.includes(svEl.tagName)) return

    const domEl = document.getElementById(svEl.id)
    let anim = domEl?.getAnimations()[0]
    if (!anim) {
        anim = domEl?.animate(svEl.kfs, {
            duration: duration.value,
            iterations: Infinity,
            delay: -currentTime.value * 1000
            // delay: currentTime.value === duration.value
            //     ? -currentTime.value + 1 : -currentTime.value
        })
        anim?.pause()
        anim?.commitStyles()
        return
    }
    const eff = (anim?.effect as KeyframeEffect)
    if (eff) {
        eff.updateTiming({
            delay: -currentTime.value * 1000
            // delay: currentTime.value === duration.value
            //     ? -currentTime.value + 1 : -currentTime.value
        })
    }
    anim.pause()
    anim?.commitStyles()

    // else {
    // let animation = domEl?.animate(el.kfs, {
    //     duration: duration.value,
    //     delay: currentTime.value === duration.value
    //         ? -currentTime.value + 1 : -currentTime.value,
    //     iterations: Infinity
    // })
    // try { animation?.pause(); animation?.commitStyles() }
    // catch { console.log('Error trying to update el: ', el) }
}



//#endregion