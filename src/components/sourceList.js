import { LitElement, html, css } from 'lit-element';

// import { ICON } from '../const';
import sharedStyle from '../sharedStyle';
import './button';

class MiniMediaPlayerSourceList extends LitElement {

  static get properties() {
    return {
      closeIcon: String,
      history: {},
      player: {},
      isOpen: Boolean,
    };
  }

  historyItems = this.history?.attributes?.options || []
  items = []

  searchTerm = ''

  get selectedIndex() {
    return this.items.map(item => item.id).indexOf(this.selected);
  }

  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName === 'history') {
        this.historyItems = this.history?.attributes?.options || oldValue?.attributes?.options || []
        this.updateItems()
      }
      if (propName === 'isOpen' && oldValue === false) {
        this.searchTerm = ''
        this.updateItems()
      }
    });
  }

  render() {
    if (!this.isOpen) return html``;
    return html`
      <div
        class='mmp-source-list'
        @click=${e => e.stopPropagation()}
      >
        <form @submit="${this.handleSubmit}">
          <input @input=${this.handleChanged} placeholder="Search..." type="search" class="mmp-source-list__input">
          <button type="submit" class="mmp-source-list__submit">Search</button>
        </form>
        <div class="mmp-source-list__items">
          ${this.items?.map(item =>  html`
          <mwc-list-item value=${item} @click=${ev => this.handleSource(ev, item)}>
              ${item ? html`<span class='mmp-source-list__item__label'>${item}</span>` : ''}
          </mwc-list-item>` )}
        </div>
      </div>
    `;
  }

  handleChanged(e) {
    e.stopPropagation();
    this.searchTerm = e.target.value;
    this.updateItems();
  }

  // handleClose(e) {
  //   e.stopPropagation();
  //   this.isOpen = false;
  //   this.dispatchEvent(new CustomEvent('closeSourceList'));
  // }

  handleSource(e, id) {
    this.player.setSource(e, id);
    this.isOpen = false;
    this.dispatchEvent(new CustomEvent('closeSourceList'));
  }

  handleSubmit(e) {
    e.preventDefault();
    this.updateItems();
  }

  updateItems() {
    const sortedSources = this.player?.sources?.sort((a,b) => (a > b) ? 1 : ((b > a) ? -1 : 0))
    if (this.searchTerm?.length > 0 &&  this.searchTerm?.length < 3) {
      this.items = []
    } else {

    }
    this.items = this.searchTerm?.length > 0 && this.searchTerm?.length < 3 ? []
      : this.searchTerm ? sortedSources?.filter(item => item.replace(/[^a-zA-Z0-9]/, '').toLowerCase().includes(this.searchTerm.replace(/[^a-zA-Z0-9]/, '').toLowerCase()))?.splice(0, 300)
      : [...this.historyItems.filter(i => i), ...sortedSources.map((a) => [Math.random(),a]).sort((a,b) => a[0]-b[0]).map((a) => a[1]).splice(0, 200) ];
    this.requestUpdate()
  }

  static get styles() {
    return [
      sharedStyle,
      css`
        :host {
          display: block;
        }
        :host([faded]) {
          opacity: .75;
        }
        :host[small] .mmp-source-list__label {
          max-width: 60px;
          display: block;
          position: relative;
          width: auto;
          text-transform: initial;
        }
        :host[full] .mmp-source-list__label {
          max-width: none;
        }
        .mmp-source-list {
          background: var(--mmp-overlay-color);
          color: var(--mmp-text-color);
          display: block;
          margin: -16px -16px 10px -16px;
          padding: 0;
        }
        .mmp-source-list__input {
          appearance: none;
          background: var(--mmp-overlay-color);
          border: none;
          border-bottom: 1px solid transparent;
          font-size: 1em;
          padding: 10px 15px;
          width: 100%;
        }
        .mmp-source-list__input:focus{
          outline: none;
          border-bottom: 1px solid white;
        }
        .mmp-source-list__submit {
          display: none;
        }
        .mmp-source-list__items {
          height: 230px;
          overflow-y: auto;
        }
      `,
    ];
  }
}

customElements.define('mmp-source-list', MiniMediaPlayerSourceList);
