interface LovelaceConfig {
  views: LovelaceView[];
}

interface LovelaceView {
  cards?: LovelaceCard[];
  sections?: LovelaceSection[];
}

interface LovelaceSection {
  cards?: LovelaceCard[];
}

interface LovelaceCard {
  id?: string;
  card?: string;
  entity?: string;
  type: string;
}

export class PopupCardManager {
  private lovelaceRoot: HTMLElement | null;
  private lovelaceConfig: LovelaceConfig | null;

  constructor(lovelaceRoot: HTMLElement | null) {
    this.lovelaceRoot = lovelaceRoot;
    this.lovelaceConfig = this.getLovelaceConfig();
  }

  static async getLovelaceRoot(): Promise<HTMLElement | null> {
    const homeAssistant = document.querySelector(
      "home-assistant"
    ) as HTMLElement | null;
    if (!homeAssistant || !homeAssistant.shadowRoot) return null;

    const homeAssistantMain = homeAssistant.shadowRoot.querySelector(
      "home-assistant-main"
    ) as HTMLElement | null;
    if (!homeAssistantMain || !homeAssistantMain.shadowRoot) return null;

    const panelLovelace = homeAssistantMain.shadowRoot.querySelector(
      "ha-panel-lovelace"
    ) as HTMLElement | null;
    if (!panelLovelace || !panelLovelace.shadowRoot) return null;

    return panelLovelace.shadowRoot.querySelector(
      "hui-root"
    ) as HTMLElement | null;
  }

  private getLovelaceConfig(): LovelaceConfig | null {
    return (this.lovelaceRoot as any)?.lovelace?.config || null;
  }

  findPopupCardConfig(id: string): LovelaceCard | null {
    if (!this.lovelaceConfig) return null;

    for (const view of this.lovelaceConfig.views) {
      const card = this.findPopupCardInView(view, id);
      if (card) return card;
    }

    return null;
  }

  private findPopupCardInView(
    view: LovelaceView,
    id: string
  ): LovelaceCard | null {
    const card = this.findCardInList(view.cards, id);
    if (card) return card;

    for (const section of view.sections || []) {
      const sectionCard = this.findCardInList(section.cards, id);
      if (sectionCard) return sectionCard;
    }

    return null;
  }

  private findCardInList(
    cards: LovelaceCard[] | undefined,
    id: string
  ): LovelaceCard | null {
    return (
      cards?.find(
        (card) => card.type === "custom:popup-card" && card.id === id
      ) || null
    );
  }
}
