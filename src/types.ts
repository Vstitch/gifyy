/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum ScreenState {
  REQUEST = 'REQUEST',
  REJECTED = 'REJECTED',
  ACCEPTED = 'ACCEPTED',
  VIDEO = 'VIDEO',
  HER_VIDEO = 'HER_VIDEO',
  STORY = 'STORY',
  REVEALED = 'REVEALED',
}

export interface GiftSettings {
  senderName: string;
  receiverName: string;
  giftText: string;
  giftTitle: string;
  iconType: 'heart' | 'star' | 'coffee' | 'cookie' | 'gift' | 'hug';
  colorTheme: 'blue' | 'pink' | 'purple' | 'green' | 'amber';
  coupons: Coupon[];
}

export interface Coupon {
  id: string;
  title: string;
  description: string;
  code: string;
  isRedeemed: boolean;
}

export interface FloatingParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  rotation: number;
  rotationSpeed: number;
  emoji: string;
  opacity: number;
}
