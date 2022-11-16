export interface SvEl {
    attrs: KeyVal[]
    children?: SvEl[]
    depth: number
    id: string
    isUncollapsed: boolean
    kfs: Keyframe[]
    // anims: Animation[]
    name?: string
    showAttrs: boolean
    tagName: string
}

export interface KeyVal {
    key: string
    val: string
}
