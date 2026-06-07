import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import Products from '../pages/Products.vue'
import ProductDetail from '../pages/ProductDetail.vue'
import AdminLogin from '../pages/AdminLogin.vue'
import AdminDashboard from '../pages/AdminDashboard.vue'
import AdminProducts from '../pages/AdminProducts.vue'
import AdminProductForm from '../pages/AdminProductForm.vue'
import AdminCategories from '../pages/AdminCategories.vue'
import { getSession, isAdmin } from '../services/authService'

const sectionRoutes = [
  { path: '/collections', hash: '#collections' },
  { path: '/colecoes', hash: '#collections' },
  { path: '/legendary', hash: '#legendary' },
  { path: '/lendarios', hash: '#legendary' },
  { path: '/forge', hash: '#forge' },
  { path: '/forjar', hash: '#forge' },
  { path: '/personalizar', hash: '#forge' },
  { path: '/shopee', hash: '#shopee' },
  { path: '/social', hash: '#social' },
  { path: '/contact', hash: '#contact' },
  { path: '/contato', hash: '#contact' },
].map((route) => ({
  path: route.path,
  redirect: { name: 'home', hash: route.hash },
}))

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/produtos', name: 'products', component: Products },
  { path: '/produto/:slug', name: 'product-detail', component: ProductDetail },
  ...sectionRoutes,
  { path: '/admin/login', name: 'admin-login', component: AdminLogin },
  { path: '/admin', name: 'admin-dashboard', component: AdminDashboard, meta: { admin: true } },
  { path: '/admin/produtos', name: 'admin-products', component: AdminProducts, meta: { admin: true } },
  { path: '/admin/produtos/novo', name: 'admin-product-new', component: AdminProductForm, meta: { admin: true } },
  { path: '/admin/produtos/:id', name: 'admin-product-edit-plain', component: AdminProductForm, meta: { admin: true } },
  { path: '/admin/produtos/:id/editar', name: 'admin-product-edit', component: AdminProductForm, meta: { admin: true } },
  { path: '/admin/categorias', name: 'admin-categories', component: AdminCategories, meta: { admin: true } },
  { path: '/:pathMatch(.*)*', redirect: { name: 'home' } },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_ROUTER_BASE || '/'),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition

    if (to.hash) {
      return new Promise((resolve) => {
        window.setTimeout(() => {
          resolve({
            el: to.hash,
            top: 96,
            behavior: 'smooth',
          })
        }, 120)
      })
    }

    return { top: 0, behavior: 'smooth' }
  },
})

router.beforeEach(async (to) => {
  if (!to.meta.admin) return true
  const session = await getSession()
  if (!session) return { name: 'admin-login', query: { redirect: to.fullPath } }
  const allowed = await isAdmin()
  if (!allowed) return { name: 'admin-login' }
  return true
})


router.afterEach((to) => {
  if (typeof document === 'undefined') return
  if (!to.path.startsWith('/admin')) return
  document.title = 'Painel da Guilda | Forja Brindes'
  let robots = document.head.querySelector('meta[name="robots"]')
  if (!robots) {
    robots = document.createElement('meta')
    robots.setAttribute('name', 'robots')
    document.head.appendChild(robots)
  }
  robots.setAttribute('content', 'noindex, nofollow')
})

export default router
