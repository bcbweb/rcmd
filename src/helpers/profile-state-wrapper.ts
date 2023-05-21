import { property } from 'lit/decorators.js'
import { connect } from 'pwa-helpers'
import { PageElement } from './page-element.js'
import notify from '../utils/notify'
import { getLinks } from '../services/link.js'
import { setLinks } from '../redux/profileSlice.js'
import store, { RootState } from '../redux/store.js'

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
  }

  connectedCallback() {
    super.connectedCallback()
    this.addEventListener('fetch-links', this._handleFetchLinks)
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

  private async _handleFetchLinks() {
    console.log('fetching links', this.email)
    if (!this.email) {
      console.log('Error fetching links')
      notify('Error fetching links', 'warning', 'exclamation-triangle')
      return
    }
    const links = await getLinks(this.email)
    console.log(links)
    store.dispatch(setLinks(links.data.Items))
    const fetchLinksEvent = new Event('fetch-links-complete', {
      bubbles: true,
      composed: true,
    })
    this.dispatchEvent(fetchLinksEvent)
  }
}
