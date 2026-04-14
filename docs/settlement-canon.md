# MESH NETWORK — Settlement Canon v1
*Nuclear Winter Club — Founding Document Series*
*Written by Ronald Edwards. AI writing assistance: Claude (Anthropic).*
*© Ronald Edwards. All Rights Reserved.*
*Canon Status: ESTABLISHED — April 2026*

---

## I. What is a Settlement?

A Settlement is any node on the MESH network — a physical location or remote operator setup that connects to the internet to broadcast Nuclear Winter content.

Settlements are independent but federated. Each runs its own stream on its own schedule, with its own VJ roster and operator identity. All are part of the same Resistance signal. All are on the MESH.

There are no corporate Settlements. There are no Covenant-aligned Settlements. If you are on the MESH, you are Resistance. The act of broadcasting is itself the declaration.

A Settlement can be:
- A physical venue running a live event
- A home studio running a weekly stream
- A remote operator node supporting another Settlement's broadcast
- A test/development node (designated separately, never referenced in Chronicles)

---

## II. The Grid System

### Origin & Philosophy
The MESH grid system is derived from Ham Radio call sign architecture — specifically the ITU region and US call district system. This is intentional. Ham radio operators kept signals alive when every other network failed. The MESH honors that lineage.

Like a Ham call sign, a MESH grid designation encodes geography, zone, and individual identity in a single readable string.

### Format
```
[Region]-[Zone][Sequence]
```
Example: `6-F1` = Region 6 (Pacific Southwest) · Zone F (San Francisco/Peninsula) · Sequence 1 (founding Settlement of that zone)

### North American Regions
*(Mirroring US Ham Radio call districts)*

| Region | Coverage | Dead Geography |
|---|---|---|
| **1** | New England | CT, MA, ME, NH, RI, VT |
| **2** | Mid-Atlantic North | NY, NJ |
| **3** | Mid-Atlantic South | DE, MD, PA, DC |
| **4** | Southeast | AL, FL, GA, KY, NC, SC, TN, VA |
| **5** | South Central | AR, LA, MS, NM, OK, TX |
| **6** | Pacific Southwest | CA, HI, NV, AZ |
| **7** | Pacific Northwest | AK, ID, MT, OR, WA, WY |
| **8** | Great Lakes | MI, OH, WV |
| **9** | Upper Midwest | IL, IN, WI |
| **0** | Central | CO, IA, KS, MN, MO, NE, ND, SD, UT |

### International Regions

| Region | Coverage |
|---|---|
| **EU-1** | Western Europe |
| **EU-2** | Northern Europe / Scandinavia |
| **EU-3** | Eastern Europe |
| **EU-4** | Southern Europe / Mediterranean |
| **AS-1** | East Asia |
| **AS-2** | Southeast Asia / Pacific |
| **AS-3** | South Asia |
| **AF-1** | Africa North |
| **AF-2** | Africa South |
| **AU-1** | Australia / New Zealand |
| **SA-1** | South America North |
| **SA-2** | South America South |

### Zone Letters
Sub-regions within each number district. Zone I is always skipped — too easily confused with the number 1. This mirrors Ham radio convention.

**Region 6 (California) Zone Map:**

| Zone | Dead Geography |
|---|---|
| **6-A** | Los Angeles Basin |
| **6-B** | San Diego / Southern Border |
| **6-C** | Central Valley |
| **6-D** | Sacramento / Northern Central |
| **6-E** | East Bay / Oakland |
| **6-F** | San Francisco / Peninsula |
| **6-G** | South Bay / San Jose |
| **6-H** | Santa Cruz / Coastal |
| **6-J** | North Bay / Marin |
| **6-K** | Far Northern CA |

### Sequence Rules
- Sequence numbers are assigned in order of Settlement founding/registration
- **Sequence 1** is always the founding or primary Settlement in a zone
- The Oasis is permanently **6-F1** — it is the origin point of the entire MESH
- Test and development nodes are designated separately (see Section VII)

---

## III. Dead Name Protocol

Every Settlement carries three identifiers simultaneously. All three are canon. All three are used in their appropriate context.

| Identifier | Definition | Example | Used In |
|---|---|---|---|
| **Grid Designation** | Tactical/operational ID on the MESH | `6-F1` | Technical config, operator comms, MESH routing |
| **Settlement Name** | Community identity — what survivors call it | `The Oasis` | Chronicles, broadcasts, in-world dialogue |
| **Dead Name** | The former city — acknowledged but not actively used | `San Francisco, CA` | Historical reference, onboarding, geography |

### The Dead Name Rule
The old world had names. The new world has grid designations and the names survivors chose for themselves. Dead Names are not erased — erasure is what The Covenant does. They are acknowledged as history, then set aside in favor of the identity the community built.

When a new Settlement registers, they choose their Settlement Name. The Dead Name is recorded automatically from their real-world location. It is never used in active Chronicles but is always available as historical context.

---

## IV. Settlement Identity Fields

Every Settlement operator configures these values in their local `.env` file. These fields define the Settlement's identity on the MESH and appear in stream overlays, operator panels, and Chronicle records.

```env
# ─── SETTLEMENT IDENTITY ────────────────────────────────────
SETTLEMENT_NAME=The Oasis
SETTLEMENT_GRID=6-F1
SETTLEMENT_DEAD_NAME=San Francisco, CA
SETTLEMENT_OPERATOR=Forced Hand
SETTLEMENT_FACTION=Resistance

# ─── BROADCAST CONFIGURATION ────────────────────────────────
SETTLEMENT_BROADCAST_SCHEDULE=Tuesday 20:00-22:00 PDT
SETTLEMENT_TIMEZONE=America/Los_Angeles
SETTLEMENT_TWITCH_CHANNEL=nuclear_winter_club

# ─── VJ ROSTER ──────────────────────────────────────────────
# Comma-separated list of VJ names active at this Settlement
# Must match OBS source names and vj_controller_streamdeck.py config
SETTLEMENT_VJ_ROSTER=Forced Hand,Midnight,Aggrofemm,Noivad

# ─── MESH NETWORK ───────────────────────────────────────────
SETTLEMENT_MESH_URL=ws://localhost:3001
SETTLEMENT_STREAM_KEY=your_stream_key_here

# ─── SIMULCAST ──────────────────────────────────────────────
# Comma-separated GRID IDs this Settlement will pull from when off-schedule
SETTLEMENT_SIMULCAST_SOURCES=

# ─── DISCORD ────────────────────────────────────────────────
DISCORD_TOKEN=your_discord_bot_token_here
DISCORD_CHANNEL=oasis-broadcast

# ─── STREAMELEMENTS ─────────────────────────────────────────
SE_JWT_TOKEN=your_streamelements_jwt_token
SE_CHAT_OVERLAY_ID=your_chat_overlay_id
SE_ALERTS_OVERLAY_ID=your_alerts_overlay_id
```

---

## V. Established Settlement Registry

### 6-F1 — The Oasis
| Field | Value |
|---|---|
| **Grid** | 6-F1 |
| **Settlement Name** | The Oasis |
| **Dead Name** | San Francisco, CA |
| **Status** | Active — Origin Point |
| **Operator** | Forced Hand (Ronald Edwards) |
| **Broadcast Schedule** | Tuesday 20:00–22:00 PDT |
| **Twitch** | twitch.tv/nuclear_winter_club |
| **VJ Roster** | Forced Hand, Midnight, Aggrofemm, Noivad |
| **Notes** | Founding Settlement. All MESH canon originates here. |

### 6-G2 — Amber Post
| Field | Value |
|---|---|
| **Grid** | 6-G2 |
| **Settlement Name** | Amber Post |
| **Dead Name** | Santa Clara, CA |
| **Status** | Reserved — First contact Cycle 52 |
| **Notes** | Silicon Valley corridor. Forced Hand on the ground. Former tech infrastructure — operators here know exactly what was running through these systems before the collapse. |

### 6-H1 — Saltline
| Field | Value |
|---|---|
| **Grid** | 6-H1 |
| **Settlement Name** | Saltline |
| **Dead Name** | Santa Cruz, CA |
| **Status** | Reserved — name confirmed, venue TBD |

### Reserved — The Forge
| Field | Value |
|---|---|
| **Grid** | TBD |
| **Settlement Name** | The Forge |
| **Dead Name** | TBD |
| **Status** | Reserved — real-world venue not yet confirmed |

### Reserved — Raven
| Field | Value |
|---|---|
| **Grid** | 6-G1 |
| **Settlement Name** | Raven |
| **Dead Name** | San Jose, CA |
| **Status** | Reserved — real-world venue not yet confirmed |

### Reserved — The Crossing
| Field | Value |
|---|---|
| **Grid** | TBD |
| **Settlement Name** | The Crossing |
| **Dead Name** | TBD |
| **Status** | Reserved — real-world venue not yet confirmed |

---

## VI. Test & Development Nodes

Test nodes are real infrastructure used for development and QA. They are **never** referenced in Chronicles or in-world broadcasts. They exist in the technical layer only.

*Active dev node: 6-G1-DEV — Raven Dev (San Jose, CA). Used for local development and QA against the Raven settlement infrastructure. The former 6-G1-TEST designation has been retired.*

**Standing rule:** Test nodes are never mentioned in Chronicles and never used as live grid designations. They exist in the technical layer only.

---

## VII. Simulcast & The Pull Model

### Philosophy
When a Settlement goes dark between broadcasts, it does not go silent. It finds the strongest signal on the MESH and amplifies it. A survivor scrolling frequencies finds not static — but another Settlement's live transmission already in progress.

This is how pirate radio networks have always worked. You find a signal. You amplify it. You pass it on.

### How It Works
1. Each Settlement configures `SETTLEMENT_SIMULCAST_SOURCES` in their `.env` — a comma-separated list of Grid IDs they trust and will pull from
2. When off-schedule, the Settlement operator manually initiates a simulcast pull from an active source
3. The originating Settlement is credited on-screen during the simulcast
4. The MESH server logs the simulcast event as a Chronicle entry

### Simulcast Chain Protocol
- A Settlement may only simulcast from another verified MESH node
- Simulcast does not require permission but courtesy contact is expected between operators
- The originating Settlement retains all creative credit
- Simulcast viewers are counted toward the originating Settlement's community

---

## VIII. The Raid Ceremony

Raids are the **handoff ritual** — the moment one Settlement ceremonially passes its signal to another. They are always performed in-world, never broken.

### Standard Raid Script — Outgoing
When initiating a Twitch raid from The Oasis, the V1 Operator fires this MESH fragment before the raid executes:

```
CAT: [TRANSMISSION]
HEADER: SIGNAL HANDOFF — GRID 6-F1 GOING DARK
BODY: Attention survivors. The Oasis broadcast is ending transmission.
We are routing the MESH signal to [TARGET SETTLEMENT NAME] at [TARGET GRID].
Do not lose the frequency. The Resistance does not go silent — it moves.
Stay on the signal. // FORCED HAND OUT //
```

### Standard Raid Script — Incoming
When The Oasis receives a raid from another Settlement:

```
CAT: [INCOMING]
HEADER: SIGNAL ACQUIRED — INCOMING FROM [SOURCE GRID]
BODY: Survivors — we are receiving a transmission from [SOURCE SETTLEMENT NAME].
[SOURCE GRID] has routed their signal to the Oasis.
Welcome to all who followed the frequency. You found us. // OASIS ONLINE //
```

---

## IX. Settlement Registration Process

This is how a new Settlement joins the MESH. The process is administered by the founding operator (Ronald Edwards / Forced Hand) with Claude as the Canon record-keeper.

### Step 1 — Operator Contact
The prospective Settlement operator contacts Nuclear Winter Club through official channels (nuclearwinter.club or Discord). They provide:
- Real-world location (city, region, country)
- Proposed Settlement name
- Operator callsign
- Intended broadcast platform and schedule
- VJ roster (if known)

### Step 2 — Grid Assignment
Ron and Claude assign:
- **Region** based on real-world geography
- **Zone** based on sub-region
- **Sequence** as the next available number in that zone
- **Dead Name** recorded from the real-world location

### Step 3 — Canon Entry
The new Settlement is added to this document with full registry entry. Status is set to **Provisioned**.

### Step 4 — Technical Onboarding
The operator receives:
- Link to `github.com/NuclearWinterClub/nw-mesh-server`
- Link to the Google Drive media package (Nuclear Winter Resources)
- A pre-filled `.env.example` with their Settlement identity fields completed
- The OBS scene collection JSON
- Setup instructions from the README

### Step 5 — Test Broadcast
The operator runs a test broadcast using a designated test node — never their live grid designation — until technical setup is verified. See Section VI for current test node designations.

### Step 6 — Activation
Once the test broadcast passes, the Settlement status is updated to **Active** in the Canon registry. Their grid designation goes live. They are on the MESH.

### Step 7 — Chronicle Entry
A founding Chronicle entry is written for the new Settlement — an in-world transmission announcing the signal has been detected. This is the Settlement's canonical birth in the world of Nuclear Winter.

---

## X. Canon Maintenance

This document is maintained by Ronald Edwards with Claude as writing assistant and record-keeper.

**When to update this document:**
- New Settlement registered (Steps 2–3 above)
- Settlement status changes (Provisioned → Active → Dormant → Dark)
- New grid zones opened (international expansion)
- Simulcast relationships established between Settlements
- Raid ceremony scripts updated

**Where this document lives:**
- **Google Drive:** `Nuclear Winter - Stream Resources/CANON/NW_Settlement_Canon_v1.md`
- **GitHub:** `NuclearWinterClub/nw-mesh-server/docs/settlement-canon.md`
- **CLAUDE.md:** Summary section referencing both locations

**Version history:**
- v1 — April 2026 — Initial canon. Grid system established. Six Settlements registered or reserved. Simulcast and Raid protocols defined.

---

*"The signal does not belong to any one Settlement. It belongs to everyone still alive enough to receive it."*

*— The Oasis, Founding Transmission*

---
*Canon Status: ESTABLISHED — April 2026*
*Written by Ronald Edwards. AI writing assistance: Claude (Anthropic).*
*© Ronald Edwards. All Rights Reserved.*
