<!-- FILE: layouts/default.vue -->
<template>
  <div class="bg-slate-900 text-slate-200 font-sans">
    <div class="relative min-h-screen max-w-4xl mx-auto pb-24">
      <main class="p-4 sm:p-6">
        <slot />
      <AuthWidgetA variant="bottom-right" />
      </main>
      <BottomNav />
    </div>
  </div>
</template>
