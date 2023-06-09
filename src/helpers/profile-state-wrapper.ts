import { property } from 'lit/decorators.js'
import { connect } from 'pwa-helpers'
import { PageElement } from './page-element.js'
import notify from '../utils/notify'
import { getLinks } from '../services/link.js'
import { getRcmds } from '../services/rcmd.js'
import { setLinks, setRcmds } from '../redux/profileSlice.js'
import store, { RootState } from '../redux/store.js'
import { isLoggedIn } from '../utils/general.js'
import { router } from '../router.js'

export class ProfileStateWrapper extends connect(store)(PageElement) {
  @property() email: string | null = null
  @property() firstName: string | null = null
  @property() lastName: string | null = null
  @property() urlHandle: string | null = null
  @property() profilePicture: string | null = null
  @property() dateOfBirth: string | null = null
  @property() gender: string | null = null
  @property() locale: string | null = null
  @property() timeZone: string | null = null
  @property() coverPicture: string | null = null
  @property() roles: Array<string> | null = []
  @property() tags: Array<string> | null = []
  @property() interests: Array<string> | null = []
  @property() profileBlocks: ProfileBlock[] | null = []
  @property() onboardingComplete: boolean | null = null
  @property() links: Link[] | null = null
  @property() rcmds: Rcmd[] | null = null
  @property() activeRole: string | null = null

  constructor() {
    super()
    this._handleFetchLinks = this._handleFetchLinks.bind(this)
    this._handleSetUserComplete = this._handleSetUserComplete.bind(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.addEventListener('fetch-rcmds', this._handleFetchRcmds)
    this.addEventListener('fetch-links', this._handleFetchLinks)
    document.addEventListener('set-user-complete', this._handleSetUserComplete)
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this.removeEventListener('fetch-links', this._handleFetchLinks)
    this.removeEventListener('set-user-complete', this._handleSetUserComplete)
  }

  stateChanged(state: RootState) {
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

  protected _handleSetUserComplete() {
    if (isLoggedIn() && !this.onboardingComplete) {
      notify('Please complete your profile to continue.', 'info')
      router.navigate('/onboarding')
    }
  }

  private async _handleFetchLinks() {
    if (!this.email) {
      notify('Error fetching links', 'warning', 'exclamation-triangle')
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
      notify('Error fetching RCMDs', 'warning', 'exclamation-triangle')
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
}
