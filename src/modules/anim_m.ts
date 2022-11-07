import { allowedEls } from "src/modules/constants";
import { SvEl } from "src/models/models";
import { computed, ref, Static } from "vue";
import { svgIO } from "./svgIO_m";
import { svEl } from "./svel_m";

// #region Anim Module

export const svgEl = () => document.querySelector('svg')
export const svgElCont = svgEl()?.parentElement

export const fps = ref(20)
export const currentTime = ref(0)
let currentTimeRefeshInterval: any = {}

export const duration = ref(1000)
export const offset = computed(() => currentTime.value / duration.value)
export const steps = computed(() => duration.value / 1000 * fps.value + 1)
export const isPlayingAnim = ref(false)


function startRefreshCurrentTimeInterval() {
    const el = svgEl()
    const x = el?.getAnimations()
    let a = {} as any
    if (x) a = x[x?.length - 1]
    currentTimeRefeshInterval = setInterval(() => {
        currentTime.value = roundedCurrentTime(a)
    }, 50)
}

const roundedCurrentTime = (a: Animation) =>
    Math.round((currentTime.value + a.currentTime!) % duration.value) / 1000

const stopRefreshCurrentTimeInterval = () => clearInterval(currentTimeRefeshInterval)



export async function playAnim(el: SvEl): Promise<void> {
    isPlayingAnim.value = true
    await playAnimLoop(el)
    startRefreshCurrentTimeInterval()
}

async function playAnimLoop(el: SvEl) {
    el.children?.forEach(async (child) => await playAnimLoop(child))
    if (!allowedEls.includes(el.tagName)) return

    // TODO: instead of access document.getById should be svgContainer.getById or smt else
    const domEl = document.getElementById(el.id)
    const anim = domEl?.getAnimations()[0]
    const eff = (anim?.effect as KeyframeEffect)
    if (eff) { eff.setKeyframes(el.kfs); anim?.play() }
    else {
        domEl?.animate(el.kfs, {
            duration: duration.value,
            delay: -currentTime.value,
            iterations: Infinity,
        })
    }
}

export async function pauseAnim(el: SvEl) {
    stopRefreshCurrentTimeInterval()
    isPlayingAnim.value = false
    await pauseAnimLoop(el)

    const anim = svgEl()?.getAnimations()[0]
    if (anim) currentTime.value = roundedCurrentTime(anim)
    // (currentTime.value + svgEl()?.getAnimations()[0].currentTime!) % duration.value

    await svgIO.output()
}

async function pauseAnimLoop(el: SvEl) {
    el.children?.forEach(async (child: SvEl) => await pauseAnimLoop(child))
    if (!allowedEls.includes(el.tagName)) return

    const domEl = document.getElementById(el.id)
    domEl?.getAnimations().forEach(anim => {
        try {
            anim?.pause();
            // if (el.tagName != 'svg') // ???? 
            anim?.commitStyles();
        }
        catch { console.log('Error trying to pause el', el) }
    })
}

export async function selectTime(i: number, svEl: SvEl) {
    currentTime.value = (i / fps.value)
    await updateAnimCurrentFrame(svEl)
}

async function updateAnimCurrentFrame(el: SvEl) {
    stopRefreshCurrentTimeInterval()
    isPlayingAnim.value = false
    await updateAnimCurrentFrameLoop(el)
    await svgIO.output()
}

async function updateAnimCurrentFrameLoop(el: SvEl) {
    el.children?.forEach(async (child: SvEl) => await updateAnimCurrentFrameLoop(child))
    if (!allowedEls.includes(el.tagName)) return

    const domEl = document.getElementById(el.id)
    const anim = domEl?.getAnimations()[0]
    if (!anim) domEl?.animate(el.kfs, {
        duration: duration.value,
        iterations: Infinity
    }).pause()
    const eff = (anim?.effect as KeyframeEffect)
    if (eff) {
        eff.updateTiming({
            delay: currentTime.value === duration.value
                ? -currentTime.value + 1 : -currentTime.value
        })
        anim?.commitStyles()
    }
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

export async function pauseOrPlayAnim() {
    isPlayingAnim.value ? await pauseAnim(svEl.value) : await playAnim(svEl.value)
}


//#endregion