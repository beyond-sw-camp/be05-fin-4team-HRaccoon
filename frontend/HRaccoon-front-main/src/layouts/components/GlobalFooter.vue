<template>
  <div class="h-100 d-flex align-center justify-space-between">
    <!-- 👉 Footer: left content -->
    <span class="d-flex align-center">
      &copy;
      {{ new Date().getFullYear() }}
      Made With
      <VIcon class="mx-1" color="error" icon="bx-heart" size="1.25rem" />
      By
      <a class="text-primary ms-1" rel="noopener noreferrer" target="_blank">HRaccoon</a>
    </span>
    <!-- 👉 Footer: right content -->
    <span class="d-md-flex gap-x-4 text-primary d-none">
      <!-- 👉 Input your right contents -->
    </span>
  </div>
</template>
