<script setup>
import { useConfirmDialog } from '@vueuse/core'
import { useStore } from '@/stores/store'
import ActionBtns from './ActionBtns.vue'
import ScoreBtns from './ScoreBtns.vue'
import Modal from './Modal.vue'
import { computed, ref, shallowRef } from 'vue'
import AddComment from './AddComment.vue'
import { storeToRefs } from 'pinia'
import { formatDistanceToNowStrict } from 'date-fns'

const store = useStore()
const { setActiveComment, currentUser, updateComment, deleteComment, incrementScore, decrementScore } = store
const { activeComment } = storeToRefs(store)

const { comment, parentId } = defineProps(['comment', 'parentId', 'isReplying'])
const starterScore = shallowRef(comment.score)

const imgAlt = `${comment.user.username}'s avatar`
const data = `${formatDistanceToNowStrict(new Date(comment.createdAt), { addSuffix: true })}`

const edittedText = ref(comment.content)
const updatedContent = computed({
	get() {
		if (comment.replyingTo) {
			return `@${comment.replyingTo} ${comment.content}`
		} else {
			return comment.content
		}
	},
	set(newValue) {
		if (comment.replyingTo) {
			const usernameLength = comment.replyingTo.length + 2
			edittedText.value = newValue.slice(usernameLength)
		} else {
			edittedText.value = newValue
		}
	},
})

const handleIncrement = () => {
	if (comment.score - starterScore.value < 1) {
		incrementScore(parentId, comment.id)
	}
}

const handleDecrement = () => {
	if (starterScore.value - comment.score < 1) {
		decrementScore(parentId, comment.id)
	}
}

const handleReply = () => {
	if (!activeComment.value || activeComment.value.id !== comment.id) {
		setActiveComment(comment.id, 'replying')
	} else {
		setActiveComment(null)
	}
}

const handleEdit = () => {
	if (!activeComment.value || activeComment.value.id !== comment.id) {
		setActiveComment(comment.id, 'editting')
	} else {
		setActiveComment(null)
	}
}

const handleUpdate = () => {
	updateComment(parentId, comment.id, edittedText.value)
}

const { isRevealed, reveal, confirm, cancel, onReveal, onConfirm, onCancel } = useConfirmDialog()

onConfirm(() => deleteComment(parentId, comment.id))
</script>

<template>
	<article class="comment">
		<div class="comment__user">
			<img :src="comment.user.image.webp" :alt="imgAlt" class="comment__img" />
			<p class="comment__name">
				{{ comment.user.username }}
			</p>
			<p v-if="currentUser.username === comment.user.username" class="comment__current">you</p>
			<p class="comment__createdAt">
				{{ data }}
			</p>
		</div>

		<form
			@submit.prevent="handleUpdate"
			v-if="activeComment && activeComment.id === comment.id && activeComment.type === 'editting'"
		>
			<textarea
				ref="edit"
				type="text"
				name="add-comment"
				class="add__textarea add__textarea--edit"
				placeholder="Add a comment..."
				v-model="updatedContent"
				rows="4"
				@keydown.enter.exact.prevent="handleUpdate"
				@keydown.enter.shift.exact="text += '\n'"
			/>
			<button type="submit" class="add__send-btn add__send-btn--edit">Update</button>
		</form>

		<p class="comment__text" v-else>
			<span v-if="comment.replyingTo" class="comment__replying">@{{ comment.replyingTo }}</span> {{ comment.content }}
		</p>

		<div class="comment__actions">
			<ScoreBtns
				:comment="comment"
				@increment="handleIncrement"
				@decrement="handleDecrement"
				:current="currentUser.username === comment.user.username"
			/>
			<ActionBtns
				@reply="handleReply"
				@edit="handleEdit"
				:reveal="reveal"
				:current="currentUser.username === comment.user.username"
			/>
		</div>
	</article>

	<AddComment
		v-show="
			!(currentUser.username === comment.user.username) &&
			activeComment &&
			activeComment.id === comment.id &&
			activeComment.type === 'replying'
		"
		:isReplying="activeComment && activeComment.id === comment.id && activeComment.type === 'replying'"
		:comment="comment"
		:parentId="parentId"
		@hide="activeComment = null"
	/>

	<Modal :isRevealed="isRevealed" :cancel="cancel" :confirm="confirm" />
</template>
