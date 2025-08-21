<script setup>
import { storeToRefs } from 'pinia'
import SingleComment from './SingleComment.vue'
import { useStore } from '@/stores/store'

const store = useStore()
const { comments } = storeToRefs(store)
</script>

<template>
	<main class="comments">
		<SingleComment v-for="comment in comments" :key="comment.id" :comment="comment" />
	</main>
</template>
