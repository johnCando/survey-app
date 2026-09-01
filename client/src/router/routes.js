const routes = [
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('@/views/HomePage.vue'), name: 'Home' },
      { path: 'survey', component: () => import('@/views/SurveyPage.vue'), name: 'Survey' },
      { path: 'results', component: () => import('@/views/ResultsPage.vue'), name: 'Results' },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('@/views/ErrorNotFound.vue'),
  },
]
export default routes