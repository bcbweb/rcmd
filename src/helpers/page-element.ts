import { LitElement } from 'lit'
import type { PropertyValues } from 'lit'
import { property } from 'lit/decorators.js'
import config from '../config.js'
import { updateMeta } from './html-meta-manager/index.js'
import type { MetaOptions } from './html-meta-manager/index.js'

export class PageElement extends LitElement {
  @property()
  email: string | null = null

  private defaultTitleTemplate = `%s | ${config.appName}`

  protected get defaultMeta() {
    return {
      url: window.location.href,
      titleTemplate: this.defaultTitleTemplate,
    }
  }

  /**
   * The page must override this method to customize the meta
   */
  protected meta(): MetaOptions | undefined {
    return
  }

  updated(changedProperties: PropertyValues<this>) {
    super.updated(changedProperties)

    const meta = this.meta()

    if (meta) {
      updateMeta({
        ...this.defaultMeta,
        ...((meta.titleTemplate || meta.titleTemplate === null) && {
          titleTemplate: meta.titleTemplate,
        }),
        ...meta,
      })
    }
  }
}
