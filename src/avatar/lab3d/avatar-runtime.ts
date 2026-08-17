/**
 * Avatar runtime — thin façade over the readable engine in ./engine/.
 *
 * The Avatar Lab export originally shipped this file with the whole engine
 * minified into two embedded strings, loaded through a Blob URL import. We
 * replaced that with the actual upstream sources (bible-strong-avatar-lab,
 * MIT) checked in under ./engine/:
 *
 *   engine/geometry.ts       3D → SVG-path projection, expressions, poses
 *                            (carries our silhouette-smoothing patch in
 *                            densifyClosedPoints)
 *   engine/surfaces.ts       body surface primitives (cube/sphere/…)
 *   engine/ambientMotion.ts  idle drift, micro-saccades, shake
 *   engine/body.ts           secondary body-node primitives
 *   engine/player.ts         SVG mount + animation/blink playback
 *
 * The public API is unchanged from the export, so botto.avatar.ts and the
 * demo pages keep working: loadAvatarRuntime(data) → { createAvatar }.
 */
import {
  mountAvatar,
  type MountOptions,
  type PlayerAvatarData,
} from './engine/player'

export type AvatarData<AnimationName extends string = string> = Readonly<{
  version: number
  avatar: Readonly<{ name: string } & Record<string, unknown>>
  expressions: Readonly<Record<string, unknown>>
  animations: Readonly<Record<AnimationName, unknown>>
}>

export type RuntimeAvatar<AnimationName extends string = string> = {
  play: (animation?: AnimationName) => RuntimeAvatar<AnimationName>
  pause: () => RuntimeAvatar<AnimationName>
  stop: () => RuntimeAvatar<AnimationName>
  destroy: () => void
}

export type AvatarRuntimeModule<AnimationName extends string = string> = {
  createAvatar: (
    target: HTMLElement | string,
    options: MountOptions<AnimationName>
  ) => RuntimeAvatar<AnimationName>
}

export const AVATAR_RUNTIME_VERSION = 1

export const loadAvatarRuntime = <AnimationName extends string>(
  data: AvatarData<AnimationName>
): Promise<AvatarRuntimeModule<AnimationName>> => {
  if (data.version !== AVATAR_RUNTIME_VERSION) {
    throw new Error(
      'Avatar data version ' + data.version + ' requires a compatible avatar-runtime.ts'
    )
  }
  // The loose AvatarData shape is the export-format boundary; the player
  // owns the precise runtime types.
  const playerData = data as unknown as PlayerAvatarData<AnimationName>
  return Promise.resolve({
    createAvatar: (target, options) => mountAvatar(playerData, target, options),
  })
}
