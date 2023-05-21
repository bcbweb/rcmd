import { LitElement } from 'lit'
import type { PropertyValues } from 'lit'
import { property } from 'lit/decorators.js'
import config from '../config.js'
import { updateMeta } from './html-meta-manager/index.js'
import type { MetaOptions } from './html-meta-manager/index.js'
import { connect } from 'pwa-helpers'
import store, { RootState } from '../redux/store.js'
import { getLinks } from '../connectors/link.js'
import { getRcmds } from '../connectors/rcmd.js'
import { setLinks, setRcmds, setActiveRole } from '../redux/profileSlice.js'
import { setRoles } from '../redux/userSlice.js'
import { notifyError } from '../utils/notify'

export class PageElement extends connect(store)(LitElement) {
  @property()
  sessionToken: string | null = null
  @property()
  email: string | null = null
  @property()
  firstName: string | null = null
  @property()
  lastName: string | null = null
  @property()
  urlHandle: string | null = null
  @property()
  profilePicture: string | null = null
  @property()
  dateOfBirth: string | null = null
  @property()
  gender: string | null = null
  @property()
  locale: string | null = null
  @property()
  timeZone: string | null = null
  @property()
  coverPicture: string | null = null
  @property()
  roles: Array<string> | null = []
  @property()
  tags: Array<string> | null = []
  @property()
  interests: Array<string> | null = []
  @property()
  profileBlocks: ProfileBlock[] | null = []
  @property()
  onboardingComplete: boolean | null = null
  @property()
  links: Link[] | null = null
  @property()
  rcmds: Rcmd[] | null = null
  @property()
  activeRole: string | null = null

  @property()
  queryParams: URLSearchParams = new URLSearchParams(window.location.search)
  @property()
  allowedRoles: string[] = ['private', 'business', 'content_creator']

  constructor() {
    super()
    this._handleFetchLinks = this._handleFetchLinks.bind(this)
    this._handleFetchRcmds = this._handleFetchRcmds.bind(this)
    this._handleAddRole = this._handleAddRole.bind(this)
    const activeRole = this.queryParams.get('profile') || 'private'
    store.dispatch(setActiveRole(activeRole))
    this._handleSwitchRole = this._handleSwitchRole.bind(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.addEventListener('fetch-links', this._handleFetchLinks)
    this.addEventListener('fetch-rcmds', this._handleFetchRcmds)
    this.addEventListener('add-role', this._handleAddRole)
    document.addEventListener('switch-role', this._handleSwitchRole)
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this.removeEventListener('fetch-links', this._handleFetchLinks)
    this.removeEventListener('fetch-rcmds', this._handleFetchRcmds)
    this.removeEventListener('add-role', this._handleAddRole)
    document.removeEventListener('switch-role', this._handleSwitchRole)
  }

  private async _handleFetchLinks() {
    if (!this.email) {
      notifyError('Error fetching links')
      return
    }
    const links = await getLinks(this.email)
    store.dispatch(setLinks(links.data.Items))
    const fetchLinksEvent = new Event('fetch-links-complete', {
      bubbles: true,
      composed: true,
    })
    this.dispatchEvent(fetchLinksEvent)
  }

  private async _handleFetchRcmds() {
    if (!this.email) {
      notifyError('Error fetching RCMDs')
      return
    }
    const rcmds = await getRcmds(this.email)
    store.dispatch(setRcmds(rcmds.data.Items))
    const fetchRcmdsEvent = new Event('fetch-rcmds-complete', {
      bubbles: true,
      composed: true,
    })
    this.dispatchEvent(fetchRcmdsEvent)
  }

  private async _handleAddRole(event: Event | CustomEvent) {
    const newRole = (event as CustomEvent).detail
    if (!this.email || !this.roles) {
      notifyError('Error adding role')
      return
    }
    if (!this.allowedRoles.includes(newRole)) {
      notifyError('Invalid role provided')
      return
    }
    // TODO add role on DB
    console.log(this.roles)
    store.dispatch(setRoles([...this.roles, newRole]))
  }

  private _handleSwitchRole(event: Event | CustomEvent) {
    console.log('switch role event received')
    const newRole = (event as CustomEvent).detail
    console.log('switch role received', newRole)
    if (!this.allowedRoles.includes(newRole)) {
      notifyError('Invalid role provided')
      return
    }
    store.dispatch(setActiveRole(newRole))
  }

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

  stateChanged(state: RootState) {
    this.sessionToken = state.auth.sessionToken
    this.email = state.user.email
    this.firstName = state.user.firstName
    this.lastName = state.user.lastName
    this.urlHandle = state.user.urlHandle
    this.profilePicture = state.user.profilePicture
    this.dateOfBirth = state.user.dateOfBirth
    this.gender = state.user.gender
    this.locale = state.user.locale
    this.timeZone = state.user.timeZone
    this.coverPicture = state.user.coverPicture
    this.roles = state.user.roles
    this.tags = state.user.tags
    this.interests = state.user.interests
    this.profileBlocks = state.user.profileBlocks
    this.onboardingComplete = state.user.onboardingComplete
    this.links = state.profile.links
    this.rcmds = state.profile.rcmds
    this.activeRole = state.profile.activeRole
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
