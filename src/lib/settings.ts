/**
 * Todos os textos e configurações editáveis do site.
 * Cada item vira um campo na tela "Textos e contato" do painel.
 * Os valores abaixo são o conteúdo inicial (vindo do briefing).
 */

export type SettingField = {
  key: string;
  label: string;
  value: string;
  type?: "text" | "textarea" | "lines" | "toggle" | "image";
  help?: string;
};

export type SettingGroup = { id: string; title: string; description?: string; fields: SettingField[] };

export const SETTING_GROUPS: SettingGroup[] = [
  {
    id: "geral",
    title: "Identidade",
    description: "Nome, assinatura e informações gerais da marca.",
    fields: [
      { key: "site_name", label: "Nome da empresa", value: "ERCA LOC" },
      { key: "tagline", label: "Assinatura da marca", value: "LOCAÇÃO DE TECNOLOGIA" },
      { key: "slogan", label: "Slogan", value: "Tecnologia que acompanha seu negócio." },
      {
        key: "logo_url",
        label: "Arquivo oficial da logo (opcional)",
        type: "image",
        value: "",
        help: "Envie a logo em PNG com fundo transparente (versão para fundo escuro). Vazio = usa a logo desenhada do site.",
      },
      {
        key: "seo_description",
        label: "Descrição para o Google",
        type: "textarea",
        value:
          "ERCA LOC: locação de notebooks, monitores, celulares e impressoras para empresas, com gestão de inventário e suporte técnico. Solicite sua cotação pelo WhatsApp.",
        help: "Aparece nos resultados de busca. Ideal: até 160 caracteres.",
      },
      {
        key: "intro_enabled",
        label: "Mostrar a abertura animada com a logo",
        type: "toggle",
        value: "1",
        help: "A abertura aparece uma vez por visita.",
      },
    ],
  },
  {
    id: "inicio",
    title: "Início (topo do site)",
    fields: [
      { key: "hero_eyebrow", label: "Chamada pequena acima do título", value: "Locação de equipamentos para empresas" },
      { key: "hero_title", label: "Título principal", value: "Tecnologia que acompanha seu negócio." },
      {
        key: "hero_text",
        label: "Texto de apresentação",
        type: "textarea",
        value:
          "Notebooks, monitores, celulares e impressoras para a sua equipe, com gestão de inventário e suporte técnico. Você foca no negócio, a gente cuida dos equipamentos.",
      },
      { key: "hero_cta", label: "Botão principal (WhatsApp)", value: "Falar com um consultor" },
      { key: "hero_cta2", label: "Botão secundário", value: "Ver equipamentos" },
      { key: "stat1_value", label: "Destaque 1 — número", value: "+2 anos" },
      { key: "stat1_label", label: "Destaque 1 — texto", value: "no mercado de locação" },
      { key: "stat2_value", label: "Destaque 2 — número", value: "B2B" },
      { key: "stat2_label", label: "Destaque 2 — texto", value: "atendimento focado em empresas" },
      { key: "stat3_value", label: "Destaque 3 — número", value: "4 linhas" },
      { key: "stat3_label", label: "Destaque 3 — texto", value: "notebooks, monitores, celulares e impressoras" },
    ],
  },
  {
    id: "sobre",
    title: "Quem somos",
    fields: [
      { key: "about_title", label: "Título", value: "Uma parceira de tecnologia para a sua empresa" },
      {
        key: "about_text",
        label: "Texto",
        type: "textarea",
        value:
          "A ERCA LOC atua há mais de dois anos com locação de equipamentos de informática para empresas. Começamos com notebooks e monitores e hoje ampliamos o portfólio para celulares e impressoras.\n\nMais do que entregar equipamentos, ajudamos a manter o parque de tecnologia organizado: com inventário, controle e suporte técnico, sua equipe trabalha sem interrupções e sua empresa evita o custo de comprar e manter aparelhos.",
        help: "Deixe uma linha em branco para separar parágrafos.",
      },
      {
        key: "about_items",
        label: "Diferenciais (um por linha)",
        type: "lines",
        value:
          "Equipamentos revisados e prontos para uso\nContratos pensados para empresas\nInventário e controle do parque\nSuporte técnico durante a locação",
      },
    ],
  },
  {
    id: "equipamentos",
    title: "Equipamentos",
    fields: [
      { key: "equip_title", label: "Título da seção", value: "Equipamentos para locação" },
      {
        key: "equip_text",
        label: "Texto da seção",
        type: "textarea",
        value: "Escolha o que a sua equipe precisa e fale com a gente para montar a proposta ideal.",
      },
      {
        key: "equip_note",
        label: "Observação geral sobre preços",
        type: "textarea",
        value:
          "Valores iniciais de referência. Configurações, disponibilidade e condições de locação são confirmadas no atendimento.",
      },
    ],
  },
  {
    id: "como",
    title: "Como funciona",
    description: "Etapas da locação, mostradas com animação no site.",
    fields: [
      { key: "how_title", label: "Título", value: "Da escolha à entrega, sem dor de cabeça" },
      {
        key: "how_text",
        label: "Texto",
        type: "textarea",
        value: "Você fala com a gente pelo WhatsApp e recebe os equipamentos prontos para a equipe trabalhar.",
      },
      {
        key: "how_steps",
        label: "Etapas (uma por linha, no formato: Título | descrição)",
        type: "lines",
        value:
          "Você escolhe | Conte quais equipamentos e quantos precisa. Montamos a proposta pelo WhatsApp.\nPreparamos | Equipamentos revisados, configurados e identificados no inventário.\nEntregamos | Levamos até a sua empresa, prontos para a equipe começar a usar.\nAcompanhamos | Suporte técnico e trocas durante todo o contrato.",
        help: "Use o caractere | para separar o título da descrição. Recomendado: 3 ou 4 etapas.",
      },
    ],
  },
  {
    id: "inventario",
    title: "Gestão de inventário",
    fields: [
      { key: "inventory_title", label: "Título", value: "Gestão de inventário" },
      {
        key: "inventory_text",
        label: "Texto",
        type: "textarea",
        value:
          "Saiba exatamente onde está cada equipamento da sua empresa. Fazemos a identificação, o registro e o controle do seu parque de tecnologia, para você ter visibilidade e segurança.",
      },
      {
        key: "inventory_items",
        label: "Itens (um por linha)",
        type: "lines",
        value:
          "Identificação e etiquetagem dos equipamentos\nControle de quem está com cada aparelho\nRegistro de entregas, trocas e devoluções\nVisão organizada de todo o parque",
      },
      { key: "inventory_cta", label: "Texto do botão", value: "Quero organizar meu inventário" },
    ],
  },
  {
    id: "suporte",
    title: "Suporte técnico",
    fields: [
      { key: "support_title", label: "Título", value: "Suporte técnico" },
      {
        key: "support_text",
        label: "Texto",
        type: "textarea",
        value:
          "Conte com apoio técnico durante toda a locação: configuração, orientação de uso e encaminhamento rápido quando algum equipamento precisar de atenção.",
      },
      {
        key: "support_items",
        label: "Itens (um por linha)",
        type: "lines",
        value:
          "Preparação e configuração dos equipamentos\nAtendimento para dúvidas e problemas\nTroca de equipamento quando necessário\nAcompanhamento durante o contrato",
      },
      { key: "support_cta", label: "Texto do botão", value: "Falar com o suporte" },
    ],
  },
  {
    id: "videos",
    title: "Vídeos",
    fields: [
      { key: "videos_title", label: "Título da seção de vídeos", value: "Veja a ERCA LOC na prática" },
      { key: "videos_text", label: "Texto da seção de vídeos", type: "textarea", value: "" },
    ],
  },
  {
    id: "contato",
    title: "Contato",
    fields: [
      { key: "contact_title", label: "Título", value: "Vamos montar a solução da sua empresa?" },
      {
        key: "contact_text",
        label: "Texto",
        type: "textarea",
        value: "Conte quantos equipamentos você precisa e por quanto tempo. Respondemos rapidamente pelo WhatsApp.",
      },
      { key: "contact_cta", label: "Texto do botão", value: "Iniciar conversa no WhatsApp" },
      { key: "contact_phone", label: "Telefone (exibição)", value: "" },
      { key: "contact_email", label: "E-mail", value: "" },
      { key: "contact_address", label: "Endereço / região de atendimento", value: "" },
      { key: "contact_hours", label: "Horário de atendimento", value: "Segunda a sexta, das 8h às 18h" },
      { key: "instagram", label: "Instagram (link completo)", value: "" },
      { key: "linkedin", label: "LinkedIn (link completo)", value: "" },
    ],
  },
  {
    id: "whatsapp",
    title: "WhatsApp",
    description: "Todos os botões comerciais do site abrem o WhatsApp com estas mensagens.",
    fields: [
      {
        key: "whatsapp_number",
        label: "Número do WhatsApp",
        value: "",
        help: "Somente números, com 55 + DDD. Exemplo: 5511987654321. Enquanto estiver vazio, os botões levam para a seção de contato.",
      },
      {
        key: "msg_default",
        label: "Mensagem padrão",
        type: "textarea",
        value: "Olá! Vim pelo site da ERCA LOC e gostaria de mais informações sobre locação de equipamentos.",
      },
      {
        key: "msg_equipment",
        label: "Mensagem dos equipamentos",
        type: "textarea",
        value: "Olá! Vim pelo site da ERCA LOC e tenho interesse na locação de {equipamento}. Pode me passar disponibilidade e condições?",
        help: "Use {equipamento} para inserir o nome do equipamento automaticamente.",
      },
      {
        key: "msg_inventory",
        label: "Mensagem de inventário",
        type: "textarea",
        value: "Olá! Gostaria de saber mais sobre o serviço de gestão de inventário da ERCA LOC.",
      },
      {
        key: "msg_support",
        label: "Mensagem de suporte",
        type: "textarea",
        value: "Olá! Gostaria de saber mais sobre o suporte técnico da ERCA LOC.",
      },
    ],
  },
];

export const SETTING_FIELDS = SETTING_GROUPS.flatMap((g) => g.fields);
export const SETTING_KEYS = new Set(SETTING_FIELDS.map((f) => f.key));
export const DEFAULT_SETTINGS: Record<string, string> = Object.fromEntries(SETTING_FIELDS.map((f) => [f.key, f.value]));

export type Settings = Record<string, string>;
