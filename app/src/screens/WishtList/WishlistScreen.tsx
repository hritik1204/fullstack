import React, { useEffect, useState, useCallback } from 'react';
import { FlatList, Text, Image, View, StyleSheet } from 'react-native';
import { useMutation } from '@tanstack/react-query';

import {
  migrateWishlist,
  getWishlist,
  saveWishlist,
  normalizeUrl,
  WishlistItem,
} from '../../storage';
import { fetchPreviewApi } from '../../api/post-wishlist';
import { useRoute } from '@react-navigation/native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import AddButton from './components/AddButton';
import AddWishlist from './components/AddWishlist';
import Header from './components/Header';

const FALLBACK_IMAGE_URL = 'https://tinyurl.com/3tr3fwdz';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#d2f1c6',
  },
  flatListContainer: {
    marginTop: 16,
  },
  itemContainer: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 0.5,
    borderColor: '#ddd',
  },
  itemImage: {
    width: 90,
    height: 90,
    borderRadius: 50,
    backgroundColor: '#eee',
  },
  itemContent: {
    marginLeft: 10,
    flexShrink: 1,
  },
  itemTitle: {
    fontWeight: '600',
  },
  itemTimestamp: {
    fontSize: 12,
    color: '#666',
  },
  footerContainer: {
    marginTop: 16,
    borderTopColor: '#000',
    borderTopWidth: 5,
    position: 'absolute',
    backgroundColor:'#d2f1c6',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 16,
    paddingTop: 16,
    paddingHorizontal: 16,
  },
  emptyContainer: {
    flex: 1,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default function WishlistScreen() {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [adding, setAdding] = useState(false);
  const [url, setUrl] = useState('');
  const {bottom} = useSafeAreaInsets()

  const route = useRoute();
  const params = (route.params || {}) as { url?: string };

  useEffect(() => {
    const data = migrateWishlist();
    setItems(data);
  }, []);

  const mutation = useMutation({
    mutationFn: (link: string) => fetchPreviewApi(link),
    onSuccess: (data) => {
      const current = getWishlist();

      const normalized = normalizeUrl(data.sourceUrl);
      const exists = current.find((i) => i.normalizedUrl === normalized);

      if (!exists) {
        const newItem: WishlistItem = {
          ...data,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          normalizedUrl: normalized,
        };
        const updated = [...current, newItem];
        saveWishlist(updated);
        setItems(updated);
      } else {
        alert('hi');
      }

      setUrl('');
      setAdding(false);
    },
  });

  useEffect(() => {
    if (params.url) {
      setAdding(true);
      setUrl(params.url);
    }
  }, [params]);

  const keyExtractor = useCallback((item: WishlistItem) => item.id, []);

  const renderItem = useCallback(
    ({ item }: { item: WishlistItem }) => (
      <View style={styles.itemContainer}>
        <Image
          source={{
            uri: item.image || FALLBACK_IMAGE_URL,
          }}
          style={styles.itemImage}
          resizeMode="contain"
        />
        <View style={styles.itemContent}>
          <Text numberOfLines={1} style={styles.itemTitle}>
            {item.title}
          </Text>
          <Text>{item.price || 'N/A'}</Text>
          <Text>{item.siteName}</Text>
          <Text style={styles.itemTimestamp}>
            {new Date(item.createdAt).toLocaleString()}
          </Text>
        </View>
      </View>
    ),
    []
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <FlatList
        data={items}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        contentContainerStyle={styles.flatListContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text>No Items Saved</Text>
          </View>
        }
      />
      <View style={[styles.footerContainer, { bottom }]}>
        {adding ? (
          <AddWishlist url={url} setUrl={setUrl} mutation={mutation} />
        ) : (
          <AddButton setAdding={setAdding} />
        )}
      </View>
    </SafeAreaView>
  );
}
