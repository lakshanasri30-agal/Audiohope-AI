import numpy as np
import random
from typing import List, Dict, Any

class HistoricalTinnitusDatabase:
    """
    Simulated Clinical Dataset of 1,250+ Tinnitus Patient Records
    Used for KNN Nearest-Neighbor Patient Matching, Statistical Recovery Benchmarking,
    and Retrainable Inference Pipelines.
    """
    def __init__(self, num_records: int = 1250):
        self.num_records = num_records
        self.records: List[Dict[str, Any]] = []
        self._generate_historical_dataset()

    def _generate_historical_dataset(self):
        np.random.seed(42)
        random.seed(42)

        occupations = ["Software Dev", "Audio Engineer", "Teacher", "Nurse", "Factory Worker", "Musician", "Manager", "Driver"]
        therapies = ["Notched Pink Noise", "Notched White Noise", "Ocean Waves LFO", "Auditory Rehab Games", "CBT Vagal Breathing", "High-Magnesium Diet"]

        for i in range(self.num_records):
            age = int(np.random.randint(18, 75))
            gender = random.choice(["Male", "Female"])
            occupation = random.choice(occupations)

            # Questionnaire Drivers
            thi_score = int(np.random.randint(12, 92))
            vas_score = float(np.round(np.random.uniform(1.5, 9.5), 1))
            stress_level = int(np.random.randint(1, 10))
            sleep_hours = float(np.round(np.random.uniform(4.0, 9.0), 1))
            noise_exp = random.choice(["Low", "Moderate", "High", "Extreme"])

            # Medical History Flags
            hearing_loss = random.choice([True, False])
            ear_infection = random.choice([True, False])
            hypertension = random.choice([True, False])

            # Predicted Outputs
            weighted_score = (thi_score * 0.45) + (vas_score * 4.8) + (stress_level * 2.5)
            if weighted_score > 65:
                severity = "Severe"
                freq = int(random.choice([4000, 4200, 6000, 8000]))
                intensity_db = int(np.random.randint(50, 75))
                recovery_pct = int(np.random.randint(60, 78))
                recovery_weeks = "6-8 Weeks"
            elif weighted_score > 35:
                severity = "Moderate"
                freq = int(random.choice([3000, 4000, 4200, 5000]))
                intensity_db = int(np.random.randint(35, 52))
                recovery_pct = int(np.random.randint(75, 88))
                recovery_weeks = "4-6 Weeks"
            else:
                severity = "Mild"
                freq = int(random.choice([1500, 2500, 4000]))
                intensity_db = int(np.random.randint(20, 38))
                recovery_pct = int(np.random.randint(86, 98))
                recovery_weeks = "2-4 Weeks"

            primary_therapy = random.choice(therapies)

            record = {
                "id": f"hist_patient_{1000 + i}",
                "age": age,
                "gender": gender,
                "occupation": occupation,
                "noise_exposure": noise_exp,
                "hearing_loss": hearing_loss,
                "ear_infection": ear_infection,
                "hypertension": hypertension,
                "thi_score": thi_score,
                "vas_score": vas_score,
                "stress_level": stress_level,
                "sleep_hours": sleep_hours,
                "dominant_frequency_hz": freq,
                "intensity_db": intensity_db,
                "severity": severity,
                "primary_therapy": primary_therapy,
                "recovery_rate_pct": recovery_pct,
                "recovery_time_weeks": recovery_weeks,
            }
            self.records.append(record)

    def find_top_k_similar_patients(self, query: Dict[str, Any], k: int = 10) -> Dict[str, Any]:
        """
        KNN Nearest Neighbor Matcher:
        Calculates normalized Euclidean distance between target patient questionnaire vector
        and all 1,250+ historical records.
        """
        q_thi = query.get("thi_score", 48)
        q_vas = query.get("vas_score", 6.5)
        q_age = query.get("age", 35)
        q_stress = query.get("stress_level", 5)
        q_pitch = query.get("pitch_hz", 4200)

        scored_records = []

        for rec in self.records:
            # Normalized Euclidean distance over key clinical features
            d_thi = ((rec["thi_score"] - q_thi) / 100.0) ** 2
            d_vas = ((rec["vas_score"] - q_vas) / 10.0) ** 2
            d_age = ((rec["age"] - q_age) / 80.0) ** 2
            d_stress = ((rec["stress_level"] - q_stress) / 10.0) ** 2
            d_pitch = ((rec["dominant_frequency_hz"] - q_pitch) / 12000.0) ** 2

            distance = np.sqrt(d_thi + d_vas + d_age + d_stress + d_pitch)
            # Convert distance into similarity percentage (0-100%)
            similarity_pct = float(np.round(max(60.0, 100.0 - (distance * 35.0)), 1))

            scored_records.append({
                "record": rec,
                "similarity_pct": similarity_pct
            })

        # Sort descending by similarity
        scored_records.sort(key=lambda x: x["similarity_pct"], reverse=True)
        top_k = scored_records[:k]

        top_similar_records = []
        total_recovery = 0.0

        for item in top_k:
            rec = item["record"]
            sim = item["similarity_pct"]
            total_recovery += rec["recovery_rate_pct"]

            top_similar_records.append({
                "patient_id": rec["id"],
                "age": rec["age"],
                "gender": rec["gender"],
                "thi_score": rec["thi_score"],
                "vas_score": rec["vas_score"],
                "severity": rec["severity"],
                "pitch_hz": rec["dominant_frequency_hz"],
                "primary_therapy": rec["primary_therapy"],
                "recovery_rate_pct": rec["recovery_rate_pct"],
                "recovery_time_weeks": rec["recovery_time_weeks"],
                "similarity_pct": sim,
            })

        avg_recovery = int(np.round(total_recovery / k))
        top_match_pct = top_k[0]["similarity_pct"] if top_k else 97.0
        most_successful_therapy = top_k[0]["record"]["primary_therapy"] if top_k else "Notched Pink Noise"

        return {
            "total_cases_analysed": self.num_records,
            "top_match_similarity_pct": top_match_pct,
            "avg_recovery_rate_pct": avg_recovery,
            "most_successful_therapy": most_successful_therapy,
            "top_similar_patients": top_similar_records
        }

historical_db = HistoricalTinnitusDatabase()
