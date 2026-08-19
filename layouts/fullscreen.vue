<template>
  <!-- 
    Pure, unstyled wrapper. 
    Allows the page component to handle its own h-screen and overflow rules safely.
  -->
  <div class="min-h-screen bg-[#F5F5F7] font-sans text-zinc-900 selection:bg-blue-200 selection:text-blue-900">
    <slot />
    <AuthWidgetA variant="top-right" />
    <BottomNav />
  </div>
</template>

