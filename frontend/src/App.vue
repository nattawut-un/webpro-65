<!-- <script>
import NavBar from './components/NavBar.vue';
import Footer from './components/Footer.vue';
import Home from './Home.vue';
import ProductList from './ProductList.vue';
import ProductAdd from './ProductAdd.vue';
import ProductDetails from './ProductDetails.vue';
import NotFound from './NotFound.vue';


const routes = {
  '/': Home,
  '/products': ProductList,
  '/admin/products/add': ProductAdd,
}

export default {
  data() {
    return {
      currentPath: window.location.pathname,
      isAdmin: false
    }
  },
  mounted() {
    window.addEventListener('hashchange', () => {
      this.currentPath = window.location.pathname;
    });
  },
  computed: {
    currentView() {
      return routes[this.currentPath || '/']
    }
  },
  components: {
    NavBar,
    Footer
  }
}
</script> -->

<template>
  <!-- <body class="bg-main">
    <NavBar />
    <component :is="currentView" />
    <Footer />
  </body> -->
</template>
