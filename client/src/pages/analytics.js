// src/pages/analytics.js
import React, { useState, useEffect } from 'react';
import {
  ArrowTrendingUpIcon,
  UsersIcon,
  CursorArrowRaysIcon,
  EyeIcon,
  RssIcon,
  SparklesIcon,
  LinkIcon,
  ChartBarIcon,
  BoltIcon, // KPI status icon
} from '@heroicons/react/24/outline';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

import axios from 'axios';
import API_URL from '@/utils/api';

import {
  InstagramIcon,
  YoutubeIcon,
  TwitterIcon,
  FacebookIcon,
  ThreadsIcon,
  LinkedinIcon,
  TiktokIcon,
  RedditIcon,
  VimeoIcon,
  PinterestIcon,
} from '@/components/SocialIcons';

// 1. Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Optional globals (if you ever need them)
const db = typeof window !== 'undefined' ? window.db : null;
const appId = typeof window !== 'undefined' ? window.appId : 'default-app-id';

// A/B test mock data
const FULL_MOCK_DATA = [
  { platform: 'instagram', label: 'Instagram (Reel)', reachA: 15000, reachB: 18000 },
  { platform: 'youtube', label: 'YouTube (Short)', reachA: 22000, reachB: 15000 },
  { platform: 'threads', label: 'Threads (Post)', reachA: 12000, reachB: 10000 },
  { platform: 'facebook', label: 'Facebook (Post)', reachA: 18000, reachB: 25000 },
  { platform: 'twitter', label: 'X (Post)', reachA: 8000, reachB: 12000 },
  { platform: 'linkedin', label: 'LinkedIn (Article)', reachA: 4000, reachB: 3500 },
  { platform: 'tiktok', label: 'TikTok (Video)', reachA: 35000, reachB: 28000 },
  { platform: 'reddit', label: 'Reddit (Community)', reachA: 6000, reachB: 9000 },
];

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
      labels: { color: '#a3a3a3' },
    },
    tooltip: {
      callbacks: {
        label: (context) =>
          `${context.dataset.label}: ${context.raw.toLocaleString()} views`,
      },
    },
  },
  scales: {
    y: {
      ticks: { color: '#a3a3a3' },
      grid: { color: '#404040' },
    },
    x: {
      ticks: { color: '#a3a3a3' },
      grid: { display: false },
    },
  },
};

// Platform share mock – matches your right-side bars
const generatePlatformShare = () => {
  const platforms = [
    { name: 'Instagram', key: 'instagram', val: 30, color: 'bg-pink-500' },
    { name: 'YouTube', key: 'youtube', val: 20, color: 'bg-red-500' },
    { name: 'TikTok', key: 'tiktok', val: 15, color: 'bg-white' },
    { name: 'Facebook', key: 'facebook', val: 12, color: 'bg-blue-600' },
    { name: 'X / Twitter', key: 'twitter', val: 8, color: 'bg-gray-500' },
    { name: 'Reddit', key: 'reddit', val: 5, color: 'bg-orange-500' },
    { name: 'LinkedIn', key: 'linkedin', val: 5, color: 'bg-blue-400' },
    { name: 'Threads', key: 'threads', val: 3, color: 'bg-neutral-600' },
    { name: 'Vimeo', key: 'vimeo', val: 2, color: 'bg-blue-800' },
  ];
  const total = platforms.reduce((sum, p) => sum + p.val, 0);
  return platforms.map((p) => ({
    ...p,
    val: `${((p.val / total) * 100).toFixed(0)}%`,
  }));
};

// Small helper to get the right icon for a platform key
const getPlatformIcon = (key, sizeClass = 'w-4 h-4') => {
  switch (key) {
    case 'instagram':
      return <InstagramIcon className={sizeClass} />;
    case 'youtube':
      return <YoutubeIcon className={sizeClass} />;
    case 'facebook':
      return <FacebookIcon className={sizeClass} />;
    case 'threads':
      return <ThreadsIcon className={sizeClass} />;
    case 'linkedin':
      return <LinkedinIcon className={sizeClass} />;
    case 'tiktok':
      return <TiktokIcon className={sizeClass} />;
    case 'reddit':
      return <RedditIcon className={sizeClass} />;
    case 'vimeo':
      return <VimeoIcon className={sizeClass} />;
    case 'pinterest':
      return <PinterestIcon className={sizeClass} />;
    case 'twitter':
      return <TwitterIcon className={sizeClass} />;
    default:
      return <LinkIcon className={`${sizeClass} text-gray-500`} />;
  }
};

export default function Analytics({ userId }) {
  const [stats, setStats] = useState({
    totalReach: '---',
    impressions: '---',
    engagementRate: '---',
    growthRate: '---',
  });
  const [loadError, setLoadError] = useState(null);
  const [availablePlatforms, setAvailablePlatforms] = useState([]);
  const [selectedFilterPlatforms, setSelectedFilterPlatforms] = useState(
    new Set()
  );

  useEffect(() => {
    // 1. Load connected platforms from localStorage
    if (typeof window !== 'undefined') {
      const savedConfig = localStorage.getItem('social_connections');
      if (savedConfig) {
        const connections = JSON.parse(savedConfig);
        const allPlatforms = [
          'instagram',
          'youtube',
          'threads',
          'facebook',
          'linkedin',
          'tiktok',
          'twitter',
          'reddit',
          'vimeo',
          'pinterest',
        ];

        const connectedKeys = allPlatforms.filter((key) => connections[key]);
        setAvailablePlatforms(connectedKeys);
        setSelectedFilterPlatforms(new Set(connectedKeys));
      }
    }

    // 2. Fetch aggregated stats from Node API (mocked)
    axios
      .get(`${API_URL}/api/stats`)
      .then((res) => {
        const totalFiles = res.data.totalMedia;
        const baseReach = totalFiles * 2000;
        const baseImpressions = baseReach * 2.5;

        setStats({
          totalReach: `${(baseReach / 1000).toFixed(1)}k`,
          impressions: `${(baseImpressions / 1000).toFixed(1)}k`,
          engagementRate: totalFiles > 0 ? `${(totalFiles / 100).toFixed(1)}%` : '0%',
          growthRate: totalFiles > 10 ? '+5.4%' : '+0.5%',
        });
      })
      .catch(() =>
        setLoadError('Failed to load statistics. Is the Node API running?')
      );
  }, [userId]);

  // Chart data filtered by selected platforms
  const generateChartData = () => {
    const filteredData = FULL_MOCK_DATA.filter((d) =>
      selectedFilterPlatforms.has(d.platform)
    );

    return {
      labels: filteredData.map((d) => d.label),
      datasets: [
        {
          label: 'Reach (Post A – AI Caption)',
          data: filteredData.map((d) => d.reachA),
          backgroundColor: 'rgba(250, 204, 21, 0.8)',
          borderColor: 'rgba(250, 204, 21, 1)',
          borderWidth: 1,
        },
        {
          label: 'Reach (Post B – Manual Caption)',
          data: filteredData.map((d) => d.reachB),
          backgroundColor: 'rgba(147, 51, 234, 0.8)',
          borderColor: 'rgba(147, 51, 234, 1)',
          borderWidth: 1,
        },
      ],
    };
  };

  const handleFilterToggle = (platformKey) => {
    setSelectedFilterPlatforms((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(platformKey)) newSet.delete(platformKey);
      else newSet.add(platformKey);
      return newSet;
    });
  };

  const recommendation = {
    title: 'A/B Winner: Manual Caption (B)',
    advice:
      'Opinionated hooks in the first 2 seconds increased average reach by 37% across X + TikTok. Double-down on punchy, human-sounding intros.',
    nextStep: 'Next 7 days: double posting frequency on X with variant B.',
  };

  const overallPerformance =
    stats.totalReach === '---'
      ? {
          message: 'Awaiting data… once you start uploading, this KPI strip will light up.',
          color: 'bg-neutral-800 border-neutral-700',
        }
      : stats.growthRate.startsWith('+') &&
        parseFloat(stats.growthRate.replace('+', '')) > 5
      ? {
          message: 'Strong performance: current experiment easily beats baseline – scale budget.',
          color: 'bg-green-600/10 border-green-600/40',
        }
      : {
          message:
            'Moderate growth: results are positive but noisy – keep testing hooks and thumbnails.',
          color: 'bg-yellow-600/10 border-yellow-600/40',
        };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-black text-white">Analytics Center</h2>
          <p className="text-neutral-400 mt-1">
            Unified performance dashboard and A/B insights.
          </p>
        </div>
        <select className="bg-neutral-800 text-white border border-neutral-700 px-4 py-2 rounded-lg text-sm outline-none focus:border-yellow-400">
          <option>Last 30 Days</option>
          <option>Last 7 Days</option>
        </select>
      </div>

      {loadError && (
        <div className="p-4 mb-4 bg-red-800/20 border border-red-700 rounded-xl text-red-400 font-bold">
          Error: {loadError}
        </div>
      )}

      {/* KPI cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        {[
          {
            title: 'Total Reach',
            value: stats.totalReach,
            icon: <UsersIcon className="w-5 h-5" />,
            color: 'text-blue-400',
          },
          {
            title: 'Impressions',
            value: stats.impressions,
            icon: <EyeIcon className="w-5 h-5" />,
            color: 'text-purple-400',
          },
          {
            title: 'Engagement Rate',
            value: stats.engagementRate,
            icon: <CursorArrowRaysIcon className="w-5 h-5" />,
            color: 'text-yellow-400',
            trend: '+2.1%',
          },
          {
            title: 'Growth Rate (30 Days)',
            value: stats.growthRate,
            icon: <ArrowTrendingUpIcon className="w-5 h-5" />,
            color: 'text-green-400',
            trend: '+0.9%',
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-neutral-800 p-6 rounded-2xl border border-neutral-700 hover:border-neutral-500 transition-colors"
          >
            <div className={`flex justify-between items-start ${stat.color} mb-4`}>
              <div className="p-2 bg-neutral-900 rounded-lg">{stat.icon}</div>
              {stat.trend && (
                <span className="text-xs font-bold bg-green-500/10 text-green-400 px-2 py-1 rounded-full">
                  {stat.trend}
                </span>
              )}
            </div>
            <p className="text-neutral-400 text-xs uppercase font-bold tracking-wider">
              {stat.title}
            </p>
            <p className="text-3xl font-black text-white mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* KPI summary strip */}
      <div
        className={`p-4 mb-8 rounded-xl flex items-center gap-4 border shadow-md ${overallPerformance.color}`}
      >
        <BoltIcon className="w-6 h-6 text-yellow-400 shrink-0" />
        <p className="text-sm font-semibold text-white">{overallPerformance.message}</p>
      </div>

      {/* MAIN BODY – flex layout to keep everything aligned */}
      <div className="lg:flex lg:items-start lg:gap-8">
        {/* LEFT COLUMN */}
        <div className="lg:w-2/3 space-y-8">
          {/* A/B chart + filters */}
          <div className="bg-neutral-800 p-8 rounded-2xl border border-neutral-700">
            <div className="flex flex-wrap justify-between gap-4 mb-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <ChartBarIcon className="w-5 h-5 text-yellow-400" />
                  A/B Reach Comparison
                </h3>
                <p className="text-xs text-neutral-400 mt-1">
                  Comparing AI-generated captions (A) vs manual copy (B) across connected
                  platforms.
                </p>
              </div>
              <div className="text-right text-xs text-neutral-400 space-y-1">
                <p>
                  <span className="font-bold text-white mr-1">Format:</span> Short vertical
                  video
                </p>
                <p>
                  <span className="font-bold text-white mr-1">Primary Channel:</span> X /
                  Twitter
                </p>
                <p>
                  <span className="font-bold text-emerald-400 mr-1">Winner:</span>
                  Manual caption (B)
                </p>
              </div>
            </div>

            {/* Platform filter */}
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="text-neutral-400 text-sm mr-2">Filter Platforms:</span>
              {availablePlatforms.map((key) => (
                <button
                  key={key}
                  onClick={() => handleFilterToggle(key)}
                  className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                    selectedFilterPlatforms.has(key)
                      ? 'bg-yellow-500 text-neutral-900'
                      : 'bg-neutral-700 text-neutral-300 hover:bg-neutral-600'
                  }`}
                >
                  {getPlatformIcon(key)}
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </button>
              ))}
            </div>

            <div className="h-80 w-full">
              <Bar options={chartOptions} data={generateChartData()} />
            </div>
          </div>

          {/* Best time to post */}
          <div className="bg-neutral-800 p-6 rounded-2xl border border-neutral-700">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <RssIcon className="w-5 h-5 text-purple-400" />
                  Best Time to Post
                </h3>
                <p className="text-xs text-neutral-400">
                  Higher bars = hotter slots based on last 30 days of activity.
                </p>
              </div>
              <span className="text-[10px] px-3 py-1 rounded-full bg-neutral-900 text-neutral-400 uppercase font-bold">
                Auto-learned
              </span>
            </div>

            <div className="text-xs text-neutral-400 grid grid-cols-5 gap-3">
              <div className="font-bold uppercase text-[11px] text-neutral-500">Platform</div>
              <div className="text-center">Morning</div>
              <div className="text-center">Afternoon</div>
              <div className="text-center">Evening</div>
              <div className="text-center">Night</div>

              {[
                {
                  key: 'instagram',
                  label: 'Instagram',
                  heat: [4, 5, 5, 2],
                },
                {
                  key: 'youtube',
                  label: 'YouTube',
                  heat: [2, 4, 5, 3],
                },
                {
                  key: 'tiktok',
                  label: 'TikTok',
                  heat: [3, 5, 5, 4],
                },
                {
                  key: 'twitter',
                  label: 'X / Twitter',
                  heat: [2, 4, 4, 3],
                },
              ].map((row) => (
                <React.Fragment key={row.key}>
                  <div className="flex items-center gap-2 mt-2">
                    {getPlatformIcon(row.key, 'w-4 h-4')}
                    <span className="text-white text-xs font-medium">{row.label}</span>
                  </div>
                  {row.heat.map((level, idx) => (
                    <div key={idx} className="flex items-center justify-center mt-2">
                      <div className="w-full h-2 bg-neutral-900 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full"
                          style={{ width: `${(level / 5) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Upcoming experiments */}
          <div className="bg-neutral-800 p-6 rounded-2xl border border-neutral-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <ChartBarIcon className="w-5 h-5 text-yellow-400" />
                Upcoming Experiments
              </h3>
              <span className="text-[10px] text-neutral-500">
                Pulled from your test backlog
              </span>
            </div>

            <div className="space-y-4">
              {[
                {
                  title: 'Hook vs No Hook',
                  desc: 'Test strong 3-sec hook vs neutral intro on Reels.',
                  platform: 'instagram',
                  status: 'Planned',
                  badgeColor: 'bg-neutral-700 text-neutral-200',
                },
                {
                  title: 'Short vs Long Caption',
                  desc: 'Compare punchy 1-liners vs story-style captions on Shorts.',
                  platform: 'youtube',
                  status: 'Scheduled',
                  badgeColor: 'bg-blue-600/20 text-blue-400',
                },
                {
                  title: 'AI vs Human Copy',
                  desc: 'Auto-generated copy vs your own voice on X.',
                  platform: 'twitter',
                  status: 'Running',
                  badgeColor: 'bg-green-600/20 text-green-400',
                },
              ].map((exp, idx) => (
                <div
                  key={idx}
                  className="bg-neutral-900 rounded-xl border border-neutral-800 px-4 py-3 flex items-center justify-between"
                >
                  <div>
                    <p className="text-sm font-bold text-white">{exp.title}</p>
                    <p className="text-xs text-neutral-400 mt-1">{exp.desc}</p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-neutral-500">
                      {getPlatformIcon(exp.platform, 'w-4 h-4')}
                      <span className="capitalize">
                        {exp.platform === 'twitter' ? 'X / Twitter' : exp.platform}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-3 py-1 rounded-full ${exp.badgeColor}`}
                  >
                    {exp.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:w-1/3 space-y-8 mt-8 lg:mt-0">
          {/* AI recommendation */}
          <div className="bg-neutral-800 p-6 rounded-2xl border border-neutral-700">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <SparklesIcon className="w-5 h-5 text-yellow-400" />
              {recommendation.title}
            </h3>
            <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800 space-y-3">
              <p className="text-sm text-neutral-300">{recommendation.advice}</p>
              <p className="text-xs text-neutral-400">
                <span className="font-semibold text-neutral-200">Next step:</span>{' '}
                {recommendation.nextStep}
              </p>
            </div>
          </div>

          {/* Platform share */}
          <div className="bg-neutral-800 p-6 rounded-2xl border border-neutral-700">
            <h3 className="text-lg font-bold text-white mb-6">Platform Share</h3>
            {generatePlatformShare().map((platform) => (
              <div key={platform.name} className="mb-4">
                <div className="flex justify-between text-sm font-bold text-white mb-1">
                  <span>{platform.name}</span>
                  <span>{platform.val}</span>
                </div>
                <div className="w-full h-3 bg-neutral-900 rounded-full overflow-hidden">
                  <div
                    style={{ width: platform.val }}
                    className={`h-full ${platform.color} rounded-full`}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          {/* Top performing posts */}
          <div className="bg-neutral-800 p-6 rounded-2xl border border-neutral-700">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <ChartBarIcon className="w-5 h-5 text-emerald-400" />
              Top Performing Posts
            </h3>

            <div className="space-y-4">
              {[
                {
                  title: '“I built a scheduler in one weekend”',
                  metricLabel: 'Watch Time',
                  metricValue: '+31%',
                  platform: 'youtube',
                },
                {
                  title: '“One line that doubled CTR”',
                  metricLabel: 'CTR',
                  metricValue: '+57%',
                  platform: 'twitter',
                },
                {
                  title: '“The hook that broke Reels”',
                  metricLabel: 'Saves',
                  metricValue: '+42%',
                  platform: 'instagram',
                },
              ].map((post, idx) => (
                <div
                  key={idx}
                  className="bg-neutral-900 rounded-xl border border-neutral-800 px-4 py-3 flex items-center justify-between"
                >
                  <div className="max-w-[70%]">
                    <p className="text-sm font-semibold text-white truncate">
                      {post.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-neutral-500">
                      {getPlatformIcon(post.platform, 'w-4 h-4')}
                      <span className="capitalize">
                        {post.platform === 'twitter'
                          ? 'X / Twitter'
                          : post.platform.charAt(0).toUpperCase() +
                            post.platform.slice(1)}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-neutral-400 uppercase tracking-wide">
                      {post.metricLabel}
                    </p>
                    <p className="text-sm font-bold text-emerald-400">
                      {post.metricValue}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
