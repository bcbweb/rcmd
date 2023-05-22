import { html, css } from 'lit'
import { property, customElement, state } from 'lit/decorators.js'
import { sharedStyles } from '../../styles/shared-styles.js'
import { flex } from '../../styles/flex.js'
import { styles } from './styles.js'
import '../../components/hero-component.js'
import '../../components/card-skeleton.js'
import { PageElement } from '../../helpers/page-element.js'
import { getUsers } from '../../services/user.js'
import { snakeToCamel } from '../../utils/general.js'
import store from '../../redux/store.js'
import { setUsers } from '../../redux/homepageSlice.js'

@customElement('page-home')
export class PageHome extends PageElement {
  @property() message = 'Recommend your world!'
  @property({ type: Array }) users = []
  @property({ type: Number }) cardsPerPage = 3

  @state() loading = false

  constructor() {
    super()
  }

  async firstUpdated() {
    this._getUsers()
  }

  share() {
    if ((navigator as any).share) {
      ;(navigator as any).share({
        title: 'RCMD: Recommend your world',
        text: 'Check out the RCMD app!',
        url: 'https://rcmd.world',
      })
    }
  }

  private async _getUsers() {
    // TODO: determine which users to fetch for the homepage
    // by passing some parameters to this call:
    this.loading = true
    try {
      const result = await getUsers()
      store.dispatch(setUsers(snakeToCamel(result)))
      this.users = snakeToCamel(result)
      this.loading = false
    } catch (error) {
      console.error(error)
    }
  }

  // TODO Fix carousel skeleton loading
  render() {
    const carouselSkeleton = Array(this.cardsPerPage * 2)
      .fill(null)
      .map(
        () =>
          html`
            <sl-carousel-item ?hidden=${!this.loading}>
              <card-skeleton></card-skeleton>
            </sl-carousel-item>
          `
      )
    return html`
      <hero-component
        title="What do you like to share?"
        text="RCMD lets you recommend your world."
        image="https://substackcdn.com/image/fetch/w_1166,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack.com%2Fimg%2Fhome_page%2Fhero_image.png"
        button-text="Start sharing"
        button-url="/register"
      >
      </hero-component>
      <div class="container">
        <header>
          <h1>${this.email}</h1>
        </header>
        <sl-carousel
          id="carousel"
          navigation
          loop
          slides-per-page=${this.cardsPerPage}
          style="--scroll-hint: 10%;"
        >
          ${this.users.length
            ? html` ${this.users.map(
                (user: UserMeta) => html`
                  <sl-carousel-item>
                    <sl-card>
                      <img
                        slot="image"
                        src=${user.coverPicture}
                        alt=${`${user.firstName} ${user.lastName}'s picture`}
                      />

                      <strong>${user.firstName} ${user.lastName}</strong><br />

                      <div slot="footer">
                        <sl-button
                          variant="primary"
                          pill
                          href=${`/${user.urlHandle}`}
                        >
                          More Info
                        </sl-button>
                        <sl-rating></sl-rating>
                      </div>
                    </sl-card>
                  </sl-carousel-item>
                `
              )}`
            : carouselSkeleton}
        </sl-carousel>
        ${'share' in navigator
          ? html`<sl-button
              slot="footer"
              variant="primary"
              @click="${this.share}"
              >Share the RCMD app!</sl-button
            >`
          : null}
      </div>
    `
  }

  static styles = [
    sharedStyles,
    flex,
    styles,
    css`
      sl-carousel-item[hidden] {
        display: none;
      }
    `,
  ]
}
