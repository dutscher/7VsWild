<script lang="ts">
    import { storedData } from '../stores';

    export let staffelKey;
    let data;

    storedData.subscribe(store => {
        data = store[staffelKey]
    });

    $: resultsSorted = Object.entries(data.status)
        .map(challenger => challenger[1])
        .sort((a, b) => {
            if (a.endResult > b.endResult) {
                return -1;
            }
            if (a.endResult < b.endResult) {
                return 1;
            }
            return 0;
        })
        .sort((a, b) => {
            return (a.isOut === b.isOut) ? 0 : a.isOut ? 1 : -1;
        })
</script>

<slot />
<div class="results flex flex--wrap">
    {#each resultsSorted as result}
        <div class="item{result.isOut ? ' transparent' : ''}">
            <img src="./images/challengers-{staffelKey}/{result.name}{result.isWinner ? '.winner' : ''}.png"
                 alt="{result.name}"/>
            <strong>{!!result.endResult ?  `${result.endResult} Punkt${result.endResult !==  1 ? 'e' : ''}` : ''}</strong><br />
            {result.exitDay > -1 ? `Ausgeschieden an Tag ${result.exitDay}` : ''}
            <!--{#if challenger.challengePoints.length > 1}&nbsp;= {challenger.challengePoints.join(' + ')}{/if}-->
        </div>
    {/each}
</div>

<style lang="scss">
  @import '../scss/variables';

  .results {
    gap: $space-xl;
    align-items: center;
    flex-direction: column;

    @media (min-width: 1024px) {
      flex-direction: inherit;
    }

    .item {
      text-align: center;

      img {
        width: 150px;
        vertical-align: middle;
      }

      strong {
        color: $color-primary-lighter;
        font-size: ms(2);
      }

      &.transparent img {
        opacity: 0.5;
        filter: grayscale(1);
      }
    }
  }
</style>
