<script setup>
const props = defineProps(['confirm', 'cancel', 'isRevealed', 'action', 'what'])
</script>

<template>
	<teleport to=".modal">
		<Transition name="dialog">
			<div v-if="isRevealed">
				<div class="modal__bg" @click="cancel"></div>
				<div class="modal__content">
					<p class="modal__title">Delete comment</p>
					<p class="modal__text">
						Are you sure you want to delete this comment? This will delete the comment and can't be undone.
					</p>
					<div class="modal__actions">
						<button @click="cancel" class="modal__btn modal__btn--cancel">NO, CANCEL</button>
						<button @click="confirm" class="modal__btn modal__btn--confirm">YES, DELETE</button>
					</div>
				</div>
			</div>
		</Transition>
	</teleport>
</template>
