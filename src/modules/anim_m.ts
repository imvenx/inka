import { allowedEls } from "src/modules/constants";
import { SvEl } from "src/models/models";
import { computed, ref, Static } from "vue";
import { svgIO } from "./svgIO_m";

// #region Anim Module

export const fps = ref(20)
export const currentTime = ref(0)
export const duration = ref(1000)
export const offset = computed(() => currentTime.value / duration.value)
export const steps = computed(() => duration.value / 1000 * fps.value + 1)
export const isPlayingAnim = ref(false)

export const svgEl = () => document.querySelector('svg')
export const svgElCont = svgEl()?.parentElement

export async function playAnim(el: SvEl): Promise<void> {
    isPlayingAnim.value = true
    await playAnimLoop(el)
}

async function playAnimLoop(el: SvEl) {
    el.children?.forEach(async (child) => await playAnimLoop(child))
    if (!allowedEls.includes(el.tagName)) return

    // TODO: instead of access document.getById should be svgContainer.getById or smt else
    document.getElementById(el.id)?.animate(el.kfs, {
        duration: duration.value,
        delay: -currentTime.value,
        iterations: Infinity,
    })
}

export async function pauseAnim(el: SvEl) {
    isPlayingAnim.value = false
    await pauseAnimLoop(el)

    currentTime.value =
        (currentTime.value + svgEl()?.getAnimations()[0].currentTime!) % duration.value

    await svgIO.output()
}

async function pauseAnimLoop(el: SvEl) {
    el.children?.forEach(async (child: SvEl) => await pauseAnimLoop(child))
    if (!allowedEls.includes(el.tagName)) return

    const domEl = document.getElementById(el.id)
    domEl?.getAnimations().forEach(anim => {
        try { anim?.pause(); if (el.tagName != 'svg') anim?.commitStyles() }
        catch { console.log('Error trying to pause el', el) }
    })
}

export function selectTime(i: number, svEl: SvEl) {
    currentTime.value = i * 1000 / fps.value
    updateAnimCurrentFrame(svEl)
}

async function updateAnimCurrentFrame(el: SvEl) {
    isPlayingAnim.value = false
    await updateAnimCurrentFrameLoop(el)
    await svgIO.output()
}

async function updateAnimCurrentFrameLoop(el: SvEl) {
    el.children?.forEach(async (child: SvEl) => await updateAnimCurrentFrameLoop(child))
    if (!allowedEls.includes(el.tagName)) return

    const domEl = document.getElementById(el.id)
    let animation = domEl?.animate(el.kfs, {
        duration: duration.value,
        delay: currentTime.value === duration.value
            ? -currentTime.value + 1 : -currentTime.value,
        iterations: Infinity
    })
    try { animation?.pause(); animation?.commitStyles() }
    catch { console.log('Error trying to update el: ', el) }
}


//#endregion