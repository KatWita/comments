<script setup>
import { useStore } from '@/stores/store'
import { computed, ref } from 'vue'
import { nanoid } from 'nanoid'

const { isReplying, comment, parentId } = defineProps(['isReplying', 'comment', 'commentId', 'parentId'])
const emit = defineEmits(['hide'])
const { currentUser, addComment, addReply } = useStore()

const imgAlt = `${currentUser.username}'s avatar`

const content = ref('')

const replyContent = computed({
	get() {
		return `@${comment.user.username}, `
	},
	set(newValue) {
		const usernameLength = comment.user.username.length + 3
		content.value = newValue.slice(usernameLength)
	},
})

const handleSubmit = () => {
	if (!content.value.trim()) {
		return
	}

	const newComment = {
		id: nanoid(),
		content: content.value,
		createdAt: Date.now(),
		score: 0,
		user: { image: { png: currentUser.image.png, webp: currentUser.image.webp }, username: currentUser.username },
		replies: [],
	}

	if (isReplying) {
		const newReply = {
			id: nanoid(),
			content: content.value,
			createdAt: Date.now(),
			score: 0,
			replyingTo: comment.user.username,
			user: { image: { png: currentUser.image.png, webp: currentUser.image.webp }, username: currentUser.username },
		}

		addReply(parentId, comment.id, newReply)
		content.value = ''

		emit('hide')
		return
	}

	addComment(newComment)
	content.value = ''
}
</script>

<template>
	<form class="add" @submit.prevent="handleSubmit">
		<textarea
			v-if="isReplying"
			type="text"
			rows="3"
			name="add-comment"
			class="add__textarea"
			placeholder="Add a comment..."
			v-model="replyContent"
			@keydown.enter.exact.prevent="handleSubmit"
			@keydown.enter.shift.exact="text += '\n'"
		/>
		<textarea
			v-else
			rows="3"
			type="text"
			name="add-comment"
			class="add__textarea"
			placeholder="Add a comment..."
			v-model="content"
			@keydown.enter.exact.prevent="handleSubmit"
			@keydown.enter.shift.exact="text += '\n'"
		/>
		<img :src="currentUser.image.webp" :alt="imgAlt" class="add__img" />
		<div class="add__btns">
			<button v-if="isReplying" type="submit" class="add__send-btn">Reply</button>
			<button v-else type="submit" class="add__send-btn">Send</button>
		</div>
	</form>
</template>
