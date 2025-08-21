<script setup>
import CommentContent from './CommentContent.vue'

const { comment } = defineProps(['comment'])
</script>

<template>
	<div class="comment-container">
		<CommentContent :comment="comment" />

		<div class="replies" v-if="comment.replies.length">
			<div class="replies__line"></div>
			<div class="replies__container">
				<CommentContent v-for="reply in comment.replies" :key="reply.id" :comment="reply" :parentId="comment.id" />
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped></style>
