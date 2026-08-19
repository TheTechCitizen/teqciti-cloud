export default defineAppConfig({
  sitename: 'teqciti-cloud',
  siteDescription: '',
  logo: '/img/logos/logo.png',
  author: {
    name: 'TheTechCitizen',
    link: 'https://thetechcitizen.com'
  },
   client: {
     name: 'NA',
     contactEmail: 'NA',
     contactPhone: 'NA',
     address: 'NA'
   },

  dashboardHome: '',

  dash: {
    defaultAvatar: '/img/avatars/3.png'
  },

   auth: {
    provider: 'primary',
    redirect: '/login'
  },

  permissions: {
    member: [
      'access_member_only_view', 
    ],
    admin: [
      'view_projects',
      'add_projects',
      'view_services',
      'view_reports',
      'view_call_center',
      'view_team',
      'manage_team',
      'filter_leads',
      'view_lead_totals',
    ],
    owner: [
      'view_projects', 
      'add_projects', 
      'view_services', 
      'view_reports', 
      'view_call_center',
      'view_team',
      'manage_team',
      'view_billing',
      'filter_leads',
      'view_lead_totals',
    ]
  },


  navbar: {
    ctashow: true,
    cta: "Login",
    ctalink: "/",
    routes: {
      company: {
        category: "Company",
        links: [
          { title: "Home", path: "/" },

      ],
      },

        services: {
          category: "Services",
          links: [],
    },
        legal: {
          category: "Legal",
          links: [
            { title: "Privacy Policy", url: "/privacy-policy" },
            { title: "Terms of Service", url: "/terms-of-service" },
          ],
    },
}
},

  footer: {
    routes: {
      company: {
        category: "Company",
        links: [
          { title: "Home", path: "/" },
      ],
      },

        services: {
          category: "Services",
          links: [],
    },
        legal: {
          category: "Legal",
          links: [
            { title: "Privacy Policy", url: "/privacy-policy" },
            { title: "Terms of Service", url: "/terms-of-service" },
          ],
    },
    },
}
})
