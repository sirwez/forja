const DEFAULT_SITE_NAME = 'Forja Brindes'
const DEFAULT_TITLE = 'Forja Brindes | Geek Store de Produtos Personalizados'
const DEFAULT_DESCRIPTION = 'Canecas, quadros, camisetas e brindes personalizados com estilo geek, otaku, gamer e criativo. Produtos sob encomenda e entregas em Timon e Teresina.'
const DEFAULT_IMAGE = '/logo.png'
const DEFAULT_KEYWORDS = 'Forja Brindes, brindes personalizados, canecas personalizadas, camisetas personalizadas, quadros personalizados, loja geek, produtos personalizados Timon, produtos personalizados Teresina, presentes geek, presentes personalizados'

function getSiteUrl() {
  const envUrl = import.meta.env.VITE_SITE_URL
  if (envUrl) return envUrl.replace(/\/$/, '')
  if (typeof window !== 'undefined') return window.location.origin
  return ''
}

function absolutize(url) {
  if (!url) return ''
  if (/^https?:\/\//i.test(url)) return url
  const siteUrl = getSiteUrl()
  const normalized = url.startsWith('/') ? url : `/${url}`
  return `${siteUrl}${normalized}`
}

function upsertMeta(selector, attrs) {
  if (typeof document === 'undefined') return
  let tag = document.head.querySelector(selector)
  if (!tag) {
    tag = document.createElement('meta')
    document.head.appendChild(tag)
  }
  Object.entries(attrs).forEach(([key, value]) => {
    if (value !== undefined && value !== null) tag.setAttribute(key, value)
  })
}

function upsertLink(rel, href) {
  if (typeof document === 'undefined' || !href) return
  let tag = document.head.querySelector(`link[rel="${rel}"]`)
  if (!tag) {
    tag = document.createElement('link')
    tag.setAttribute('rel', rel)
    document.head.appendChild(tag)
  }
  tag.setAttribute('href', href)
}

function removeStructuredData(scope = 'page') {
  if (typeof document === 'undefined') return
  document.head.querySelectorAll(`script[type="application/ld+json"][data-seo="${scope}"]`).forEach((tag) => tag.remove())
}

function addStructuredData(data, scope = 'page') {
  if (typeof document === 'undefined' || !data) return
  const items = Array.isArray(data) ? data : [data]
  removeStructuredData(scope)
  items.filter(Boolean).forEach((item) => {
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.dataset.seo = scope
    script.textContent = JSON.stringify(item)
    document.head.appendChild(script)
  })
}

export function buildUrl(path = '/') {
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  return `${getSiteUrl()}${cleanPath}`
}

export function useSeo(options = {}) {
  const title = options.title || DEFAULT_TITLE
  const description = options.description || DEFAULT_DESCRIPTION
  const path = options.path || (typeof window !== 'undefined' ? window.location.pathname : '/')
  const url = options.url || buildUrl(path)
  const image = absolutize(options.image || DEFAULT_IMAGE)
  const type = options.type || 'website'
  const robots = options.robots || 'index, follow, max-image-preview:large'
  const keywords = options.keywords || DEFAULT_KEYWORDS

  if (typeof document === 'undefined') return

  document.title = title
  document.documentElement.lang = 'pt-BR'

  upsertMeta('meta[name="description"]', { name: 'description', content: description })
  upsertMeta('meta[name="keywords"]', { name: 'keywords', content: keywords })
  upsertMeta('meta[name="robots"]', { name: 'robots', content: robots })
  upsertMeta('meta[name="theme-color"]', { name: 'theme-color', content: '#0B0B0D' })
  upsertMeta('meta[name="author"]', { name: 'author', content: DEFAULT_SITE_NAME })

  upsertMeta('meta[property="og:locale"]', { property: 'og:locale', content: 'pt_BR' })
  upsertMeta('meta[property="og:site_name"]', { property: 'og:site_name', content: DEFAULT_SITE_NAME })
  upsertMeta('meta[property="og:type"]', { property: 'og:type', content: type })
  upsertMeta('meta[property="og:title"]', { property: 'og:title', content: title })
  upsertMeta('meta[property="og:description"]', { property: 'og:description', content: description })
  upsertMeta('meta[property="og:url"]', { property: 'og:url', content: url })
  upsertMeta('meta[property="og:image"]', { property: 'og:image', content: image })
  upsertMeta('meta[property="og:image:alt"]', { property: 'og:image:alt', content: options.imageAlt || 'Logo da Forja Brindes' })

  upsertMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' })
  upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: title })
  upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: description })
  upsertMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: image })

  upsertLink('canonical', url)

  if (options.structuredData) {
    addStructuredData(options.structuredData, options.structuredDataScope || 'page')
  } else {
    removeStructuredData(options.structuredDataScope || 'page')
  }
}

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Store',
    '@id': `${getSiteUrl()}/#store`,
    name: DEFAULT_SITE_NAME,
    url: getSiteUrl(),
    logo: absolutize(DEFAULT_IMAGE),
    image: absolutize(DEFAULT_IMAGE),
    description: DEFAULT_DESCRIPTION,
    telephone: '+55 86 8884-3379',
    sameAs: ['https://www.instagram.com/forjabrindes/'],
    areaServed: [
      { '@type': 'City', name: 'Timon' },
      { '@type': 'City', name: 'Teresina' },
    ],
    openingHoursSpecification: [
      { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '08:00', closes: '20:00' },
      { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Saturday', opens: '08:00', closes: '15:00' },
    ],
  }
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${getSiteUrl()}/#website`,
    name: DEFAULT_SITE_NAME,
    url: getSiteUrl(),
    potentialAction: {
      '@type': 'SearchAction',
      target: `${getSiteUrl()}/produtos?busca={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }
}

export function itemListSchema(products = [], name = 'Produtos personalizados da Forja Brindes') {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    itemListElement: products.slice(0, 12).map((product, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: buildUrl(`/produto/${product.slug}`),
      name: product.name,
    })),
  }
}

export function productSchema(product) {
  if (!product) return null

  const price = product.price ? Number(product.price).toFixed(2) : undefined

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: [product.image_url, ...(product.gallery || [])].filter(Boolean).map(absolutize),
    description: product.description || product.short_description || `Produto personalizado ${product.name} da Forja Brindes.`,
    category: product.category?.name || product.item_type || 'Produto personalizado',
    brand: {
      '@type': 'Brand',
      name: DEFAULT_SITE_NAME,
    },
    offers: {
      '@type': 'Offer',
      url: buildUrl(`/produto/${product.slug}`),
      priceCurrency: 'BRL',
      ...(price ? { price } : {}),
      availability: product.stock > 0 || product.shopee_url ? 'https://schema.org/InStock' : 'https://schema.org/PreOrder',
      itemCondition: 'https://schema.org/NewCondition',
      seller: {
        '@type': 'Organization',
        name: DEFAULT_SITE_NAME,
      },
    },
  }
}
