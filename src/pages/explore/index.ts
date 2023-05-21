import { html } from 'lit'
import { customElement } from 'lit/decorators.js'
import { styles } from './styles.js'
import { sharedStyles } from '../../styles/shared-styles.js'
import { PageElement } from '../../helpers/page-element.js'
import { openSearchDrawer } from '../../utils/general.js'
import '../../components/card-grid.js'

@customElement('page-explore')
export class PageExplore extends PageElement {
  static styles = [sharedStyles, styles]

  constructor() {
    super()
  }

  render() {
    return html`
      <div class="container">
        <div slot="header">
          <h1>Explore</h1>
        </div>

        <sl-button size="large" @click=${() => openSearchDrawer()}>
          <sl-icon name="search" slot="prefix"></sl-icon>
          Search
        </sl-button>

        <sl-tab-group placement="start">
          <sl-tab slot="nav" panel="people">People</sl-tab>
          <sl-tab slot="nav" panel="content-creators">Content creators</sl-tab>
          <sl-tab slot="nav" panel="businesses">Businesses</sl-tab>
          <sl-tab slot="nav" panel="rcmds">RCMDs</sl-tab>

          <sl-tab-panel name="people">
            <card-grid title="People">
              <sl-card slot="card">
                <img
                  slot="image"
                  src="https://images.unsplash.com/photo-1559209172-0ff8f6d49ff7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=80"
                  alt="A kitten sits patiently between a terracotta pot and decorative grasses."
                />

                <strong>Mittens</strong><br />
                This kitten is as cute as he is playful. Bring him home
                today!<br />
                <small>6 weeks old</small>

                <div slot="footer">
                  <sl-button variant="primary" pill>More Info</sl-button>
                  <sl-rating></sl-rating>
                </div>
              </sl-card>
              <sl-card slot="card">
                <img
                  slot="image"
                  src="https://images.unsplash.com/photo-1559209172-0ff8f6d49ff7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=80"
                  alt="A kitten sits patiently between a terracotta pot and decorative grasses."
                />

                <strong>Mittens</strong><br />
                This kitten is as cute as he is playful. Bring him home
                today!<br />
                <small>6 weeks old</small>

                <div slot="footer">
                  <sl-button variant="primary" pill>More Info</sl-button>
                  <sl-rating></sl-rating>
                </div>
              </sl-card>
              <sl-card slot="card">
                <img
                  slot="image"
                  src="https://images.unsplash.com/photo-1559209172-0ff8f6d49ff7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=80"
                  alt="A kitten sits patiently between a terracotta pot and decorative grasses."
                />

                <strong>Mittens</strong><br />
                This kitten is as cute as he is playful. Bring him home
                today!<br />
                <small>6 weeks old</small>

                <div slot="footer">
                  <sl-button variant="primary" pill>More Info</sl-button>
                  <sl-rating></sl-rating>
                </div>
              </sl-card>
              <sl-card slot="card">
                <img
                  slot="image"
                  src="https://images.unsplash.com/photo-1559209172-0ff8f6d49ff7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=80"
                  alt="A kitten sits patiently between a terracotta pot and decorative grasses."
                />

                <strong>Mittens</strong><br />
                This kitten is as cute as he is playful. Bring him home
                today!<br />
                <small>6 weeks old</small>

                <div slot="footer">
                  <sl-button variant="primary" pill>More Info</sl-button>
                  <sl-rating></sl-rating>
                </div>
              </sl-card>
              <sl-card slot="card">
                <img
                  slot="image"
                  src="https://images.unsplash.com/photo-1559209172-0ff8f6d49ff7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=80"
                  alt="A kitten sits patiently between a terracotta pot and decorative grasses."
                />

                <strong>Mittens</strong><br />
                This kitten is as cute as he is playful. Bring him home
                today!<br />
                <small>6 weeks old</small>

                <div slot="footer">
                  <sl-button variant="primary" pill>More Info</sl-button>
                  <sl-rating></sl-rating>
                </div>
              </sl-card>
              <sl-card slot="card">
                <img
                  slot="image"
                  src="https://images.unsplash.com/photo-1559209172-0ff8f6d49ff7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=80"
                  alt="A kitten sits patiently between a terracotta pot and decorative grasses."
                />

                <strong>Mittens</strong><br />
                This kitten is as cute as he is playful. Bring him home
                today!<br />
                <small>6 weeks old</small>

                <div slot="footer">
                  <sl-button variant="primary" pill>More Info</sl-button>
                  <sl-rating></sl-rating>
                </div>
              </sl-card>
              <sl-card slot="card">
                <img
                  slot="image"
                  src="https://images.unsplash.com/photo-1559209172-0ff8f6d49ff7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=80"
                  alt="A kitten sits patiently between a terracotta pot and decorative grasses."
                />

                <strong>Mittens</strong><br />
                This kitten is as cute as he is playful. Bring him home
                today!<br />
                <small>6 weeks old</small>

                <div slot="footer">
                  <sl-button variant="primary" pill>More Info</sl-button>
                  <sl-rating></sl-rating>
                </div>
              </sl-card>
              <sl-card slot="card">
                <img
                  slot="image"
                  src="https://images.unsplash.com/photo-1559209172-0ff8f6d49ff7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=80"
                  alt="A kitten sits patiently between a terracotta pot and decorative grasses."
                />

                <strong>Mittens</strong><br />
                This kitten is as cute as he is playful. Bring him home
                today!<br />
                <small>6 weeks old</small>

                <div slot="footer">
                  <sl-button variant="primary" pill>More Info</sl-button>
                  <sl-rating></sl-rating>
                </div>
              </sl-card>
              <sl-card slot="card">
                <img
                  slot="image"
                  src="https://images.unsplash.com/photo-1559209172-0ff8f6d49ff7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=80"
                  alt="A kitten sits patiently between a terracotta pot and decorative grasses."
                />

                <strong>Mittens</strong><br />
                This kitten is as cute as he is playful. Bring him home
                today!<br />
                <small>6 weeks old</small>

                <div slot="footer">
                  <sl-button variant="primary" pill>More Info</sl-button>
                  <sl-rating></sl-rating>
                </div>
              </sl-card>
              <sl-card slot="card">
                <img
                  slot="image"
                  src="https://images.unsplash.com/photo-1559209172-0ff8f6d49ff7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=80"
                  alt="A kitten sits patiently between a terracotta pot and decorative grasses."
                />

                <strong>Mittens</strong><br />
                This kitten is as cute as he is playful. Bring him home
                today!<br />
                <small>6 weeks old</small>

                <div slot="footer">
                  <sl-button variant="primary" pill>More Info</sl-button>
                  <sl-rating></sl-rating>
                </div>
              </sl-card>
              <sl-card slot="card">
                <img
                  slot="image"
                  src="https://images.unsplash.com/photo-1559209172-0ff8f6d49ff7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=80"
                  alt="A kitten sits patiently between a terracotta pot and decorative grasses."
                />

                <strong>Mittens</strong><br />
                This kitten is as cute as he is playful. Bring him home
                today!<br />
                <small>6 weeks old</small>

                <div slot="footer">
                  <sl-button variant="primary" pill>More Info</sl-button>
                  <sl-rating></sl-rating>
                </div>
              </sl-card>
              <sl-card slot="card">
                <img
                  slot="image"
                  src="https://images.unsplash.com/photo-1559209172-0ff8f6d49ff7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=80"
                  alt="A kitten sits patiently between a terracotta pot and decorative grasses."
                />

                <strong>Mittens</strong><br />
                This kitten is as cute as he is playful. Bring him home
                today!<br />
                <small>6 weeks old</small>

                <div slot="footer">
                  <sl-button variant="primary" pill>More Info</sl-button>
                  <sl-rating></sl-rating>
                </div>
              </sl-card>
            </card-grid>
          </sl-tab-panel>
          <sl-tab-panel name="content-creators">
            <card-grid title="Content creators"></card-grid>
          </sl-tab-panel>
          <sl-tab-panel name="businesses">
            <card-grid title="Businesses"></card-grid>
          </sl-tab-panel>
          <sl-tab-panel name="rcmds">
            <card-grid title="RCMDs"></card-grid>
          </sl-tab-panel>
        </sl-tab-group>
      </div>
    `
  }
}
