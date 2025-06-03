<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { RiVolumeUpLine, RiVolumeMuteLine, RiVolumeDownLine } from '@remixicon/vue';

const props = defineProps<{
  audioData: ArrayBuffer;
  isPlaying: boolean;
}>();

const emit = defineEmits<{
  (e: 'play'): void;
  (e: 'pause'): void;
  (e: 'ended'): void;
}>();

const audioContext = ref<AudioContext | null>(null);
const audioSource = ref<AudioBufferSourceNode | null>(null);
const gainNode = ref<GainNode | null>(null);
const volume = ref(1);
const isMuted = ref(false);

onMounted(() => {
  audioContext.value = new AudioContext();
  gainNode.value = audioContext.value.createGain();
  gainNode.value.connect(audioContext.value.destination);
});

onUnmounted(() => {
  if (audioSource.value) {
    audioSource.value.stop();
  }
  if (audioContext.value) {
    audioContext.value.close();
  }
});

async function playAudio() {
  if (!audioContext.value || !gainNode.value) return;

  try {
    const audioBuffer = await audioContext.value.decodeAudioData(props.audioData);
    audioSource.value = audioContext.value.createBufferSource();
    audioSource.value.buffer = audioBuffer;
    audioSource.value.connect(gainNode.value);
    
    audioSource.value.onended = () => {
      emit('ended');
    };
    
    audioSource.value.start(0);
    emit('play');
  } catch (error) {
    console.error('音频播放失败:', error);
  }
}

function pauseAudio() {
  if (audioSource.value) {
    audioSource.value.stop();
    audioSource.value = null;
    emit('pause');
  }
}

function toggleMute() {
  if (!gainNode.value) return;
  isMuted.value = !isMuted.value;
  gainNode.value.gain.value = isMuted.value ? 0 : volume.value;
}

function adjustVolume(newVolume: number) {
  if (!gainNode.value) return;
  volume.value = Math.max(0, Math.min(1, newVolume));
  if (!isMuted.value) {
    gainNode.value.gain.value = volume.value;
  }
}
</script>

<template>
  <div class="audio-player">
    <div class="controls">
      <button 
        class="play-button" 
        @click="props.isPlaying ? pauseAudio() : playAudio()"
      >
        {{ props.isPlaying ? '⏸' : '▶' }}
      </button>
      
      <button 
        class="mute-button" 
        @click="toggleMute"
      >
        <RiVolumeMuteLine v-if="isMuted" />
        <RiVolumeDownLine v-else-if="volume < 0.5" />
        <RiVolumeUpLine v-else />
      </button>
      
      <input 
        type="range" 
        min="0" 
        max="1" 
        step="0.1" 
        v-model="volume"
        @input="(e: Event) => adjustVolume(Number((e.target as HTMLInputElement).value))"
        class="volume-slider"
      />
    </div>
  </div>
</template>

<style scoped>
.audio-player {
  display: flex;
  align-items: center;
  padding: 4px 8px;
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 4px;
}

.controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.play-button,
.mute-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  color: #666;
  transition: color 0.2s;
}

.play-button:hover,
.mute-button:hover {
  color: #333;
}

.volume-slider {
  width: 60px;
  height: 4px;
  -webkit-appearance: none;
  background: #ddd;
  border-radius: 2px;
  outline: none;
}

.volume-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 12px;
  height: 12px;
  background: #666;
  border-radius: 50%;
  cursor: pointer;
}

.volume-slider::-moz-range-thumb {
  width: 12px;
  height: 12px;
  background: #666;
  border-radius: 50%;
  cursor: pointer;
  border: none;
}
</style> 