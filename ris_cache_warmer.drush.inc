<?php


/**
 * Implementation of hook_drush_coommand().
 */
function ris_cache_warmer_drush_command() {

  $items['ris-cache-warmer'] = array(
    'description' => 'Handle all items in the responsive image cache-warmer-queue.',
    'aliases' => array('rcw'),
  );

  return $items;
}


/**
 * Implementation of the drush command.
 */
function drush_ris_cache_warmer() {

  $item = TRUE;

  $queue = DrupalQueue::get('ris_cache_warmer');
  $num_items = $queue->numberOfItems();
  $processed_items = 0;
  while ($item) {
    if ($item = $queue->claimItem()) {
      drush_print(round(100.0 * $processed_items / $num_items) . '% done. Getting ' . $item->data['url']);
      ris_cache_warmer_worker($item->data);
      $queue->deleteItem($item);
      $processed_items++;
    }
  }
}
