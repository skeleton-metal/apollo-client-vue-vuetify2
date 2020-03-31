import CustomizationPage from './pages/CustomizationPage'

export const customizationRoutes = [
    {
        name: "customization",
        path: '/admin/customization',
        component: CustomizationPage,
        meta: {
            requiresAuth: false,
            role: "admin"
        }
    },

]